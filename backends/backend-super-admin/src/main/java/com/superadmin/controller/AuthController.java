package com.superadmin.controller;

import com.superadmin.dto.AuthResponse;
import com.superadmin.dto.LoginRequest;
import com.superadmin.dto.RefreshRequest;
import com.superadmin.dto.RegisterRequest;
import com.superadmin.model.User;
import com.superadmin.repository.UserRepository;
import com.superadmin.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
            String jwt = tokenProvider.generateToken(user.getUsername(), user.getEmail(), user.getRole());

            if (user.getStatus().equalsIgnoreCase("BLOCKED") || user.getStatus().equalsIgnoreCase("SUSPENDED")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is " + user.getStatus());
            }

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    "Bearer",
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Address already in use");
        }

        if (registerRequest.getRole().toUpperCase().contains("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Registration of administrative roles is prohibited.");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole().toUpperCase());
        user.setStatus("PENDING");

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshUserToken(@RequestBody RefreshRequest refreshRequest) {
        String token = refreshRequest.getToken();
        if (tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromJWT(token);
            String newToken = tokenProvider.generateToken(username);
            Optional<User> userOpt = userRepository.findByUsername(username);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return ResponseEntity.ok(new AuthResponse(
                        newToken,
                        "Bearer",
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }

    @PostMapping("/forgot-password-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody java.util.Map<String, String> body) {
        String identifier = body.get("identifier");
        if (identifier == null || identifier.isEmpty()) {
            return ResponseEntity.badRequest().body("Identifier (email/username) is required.");
        }

        Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(identifier);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole().toUpperCase().contains("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Administrative password reset must be managed directly via server console.");
            }
            user.setStatus("PENDING_RESET");
            userRepository.save(user);
            return ResponseEntity.ok("Password reset request submitted. Super Admin notification dispatched to generate reset OTP.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User account not found.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtpAndResetPassword(@RequestBody java.util.Map<String, String> body) {
        String identifier = body.get("identifier");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        if (identifier == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Identifier, OTP, and new password are required.");
        }

        Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(identifier);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtpCode() != null && user.getOtpCode().equals(otp)) {
                if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP has expired. Please ask Super Admin to regenerate.");
                }

                user.setPassword(passwordEncoder.encode(newPassword));
                user.setStatus("ACTIVE");
                user.setOtpCode(null);
                user.setOtpExpiry(null);
                userRepository.save(user);

                return ResponseEntity.ok("OTP verified successfully. Password updated and account activated.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP code.");
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
    }
}
