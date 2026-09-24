package com.parent.controller;

import com.parent.model.ChildProfile;
import com.parent.model.SubscriptionPayment;
import com.parent.model.ParentWallet;
import com.parent.repository.ChildProfileRepository;
import com.parent.repository.SubscriptionPaymentRepository;
import com.parent.repository.ParentWalletRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/parent")
@CrossOrigin(origins = "*")
public class RazorpayPaymentController {

    @Autowired
    private ChildProfileRepository childProfileRepository;

    @Autowired
    private SubscriptionPaymentRepository subscriptionPaymentRepository;

    @Autowired
    private ParentWalletRepository parentWalletRepository;

    @Value("${app.demo-mode:true}")
    private boolean demoMode;

    // Loading Razorpay credentials from properties (using mock defaults for compilation and execution if missing)
    @Value("${razorpay.key.id:rzp_test_mockKeyId123}")
    private String keyId;

    @Value("${razorpay.key.secret:mockKeySecret456789}")
    private String keySecret;

    private String getAuthenticatedUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Map) {
            Map<?, ?> principal = (Map<?, ?>) auth.getPrincipal();
            return (String) principal.get("email");
        }
        return null;
    }

    @PostMapping("/payment/order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> requestData) {
        try {
            double amount = Double.parseDouble(requestData.get("amount").toString());
            String currency = requestData.getOrDefault("currency", "INR").toString();
            String receipt = "rcpt_" + UUID.randomUUID().toString().substring(0, 8);

            // Razorpay expects amount in paise (1 INR = 100 paise)
            int amountInPaise = (int) (amount * 100);

            // Initialize Razorpay Client
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);
            
            Order order = razorpay.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", amount);
            response.put("currency", currency);
            response.put("keyId", keyId);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            // Handle Razorpay exceptions and fall back to mock order id for local demo
            Map<String, Object> mockResponse = new HashMap<>();
            mockResponse.put("orderId", "order_mock_" + UUID.randomUUID().toString().substring(0, 8));
            mockResponse.put("amount", requestData.get("amount"));
            mockResponse.put("currency", "INR");
            mockResponse.put("keyId", keyId);
            mockResponse.put("message", "Simulated Mock Order (Razorpay server unreachable: " + e.getMessage() + ")");
            return ResponseEntity.ok(mockResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/payment/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> requestData) {
        String paymentId = (String) requestData.get("razorpay_payment_id");
        String orderId = (String) requestData.get("razorpay_order_id");
        String signature = (String) requestData.get("razorpay_signature");
        Long childId = Long.parseLong(requestData.get("child_id").toString());
        String planType = (String) requestData.get("plan_type");
        String parentEmail = (String) requestData.get("parent_email");
        
        String authenticatedEmail = getAuthenticatedUserEmail();
        if (authenticatedEmail != null && !authenticatedEmail.isEmpty()) {
            parentEmail = authenticatedEmail;
        }
        
        String cabId = (String) requestData.get("cab_id");
        double amount = Double.parseDouble(requestData.get("amount").toString());

        boolean isSignatureValid = false;

        // Perform signature verification
        try {
            if (orderId != null && orderId.startsWith("order_mock_") && demoMode) {
                // Auto-pass verification for simulation orders in demo mode
                isSignatureValid = true;
            } else {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", orderId);
                options.put("razorpay_payment_id", paymentId);
                options.put("razorpay_signature", signature);
                isSignatureValid = com.razorpay.Utils.verifyPaymentSignature(options, keySecret);
            }
        } catch (Exception e) {
            isSignatureValid = false;
        }

        if (isSignatureValid) {
            // Update child cab confirmation
            Optional<ChildProfile> op = childProfileRepository.findById(childId);
            if (op.isPresent()) {
                ChildProfile child = op.get();
                child.setCabId(cabId);
                child.setVerificationStatus("VERIFIED"); // Verify profile on successful payment
                childProfileRepository.save(child);
            }

            // Log the subscription payment to MySQL
            SubscriptionPayment payment = new SubscriptionPayment();
            payment.setParentEmail(parentEmail);
            payment.setChildId(childId);
            payment.setAmount(amount);
            payment.setPlanType(planType != null ? planType.toUpperCase() : "MONTHLY");
            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setInvoiceNumber("INV-" + orderId.substring(orderId.length() - 8).toUpperCase());
            subscriptionPaymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("message", "Payment verified and student cab assignment confirmed successfully.");
            response.put("invoiceNumber", payment.getInvoiceNumber());
            return ResponseEntity.ok(response);
        } else {
            // Log failed payment
            SubscriptionPayment payment = new SubscriptionPayment();
            payment.setParentEmail(parentEmail);
            payment.setChildId(childId);
            payment.setAmount(amount);
            payment.setPlanType(planType != null ? planType.toUpperCase() : "MONTHLY");
            payment.setStatus("FAILED");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setInvoiceNumber("INV-FAIL");
            subscriptionPaymentRepository.save(payment);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "FAILED");
            response.put("message", "Razorpay payment signature mismatch or invalid transaction.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/wallet")
    public ResponseEntity<ParentWallet> getWallet(@RequestParam(required = false) String email) {
        String userEmail = getAuthenticatedUserEmail();
        if (userEmail == null || userEmail.isEmpty()) {
            userEmail = email;
        }
        if (userEmail == null || userEmail.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        final String finalEmail = userEmail;
        ParentWallet wallet = parentWalletRepository.findByParentEmail(finalEmail)
                .orElseGet(() -> {
                    ParentWallet nw = new ParentWallet();
                    nw.setParentEmail(finalEmail);
                    nw.setBalance(0.0);
                    return parentWalletRepository.save(nw);
                });
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/wallet/add/verify")
    public ResponseEntity<?> verifyWalletAdd(@RequestBody Map<String, Object> requestData) {
        String paymentId = (String) requestData.get("razorpay_payment_id");
        String orderId = (String) requestData.get("razorpay_order_id");
        String signature = (String) requestData.get("razorpay_signature");
        String email = (String) requestData.get("parent_email");
        
        String authenticatedEmail = getAuthenticatedUserEmail();
        if (authenticatedEmail != null && !authenticatedEmail.isEmpty()) {
            email = authenticatedEmail;
        }
        
        double amount = Double.parseDouble(requestData.get("amount").toString());

        boolean isSignatureValid = false;
        try {
            if (orderId != null && orderId.startsWith("order_mock_") && demoMode) {
                isSignatureValid = true;
            } else {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", orderId);
                options.put("razorpay_payment_id", paymentId);
                options.put("razorpay_signature", signature);
                isSignatureValid = com.razorpay.Utils.verifyPaymentSignature(options, keySecret);
            }
        } catch (Exception e) {
            isSignatureValid = false;
        }

        if (isSignatureValid) {
            final String finalEmail = email;
            ParentWallet wallet = parentWalletRepository.findByParentEmail(finalEmail)
                    .orElseGet(() -> {
                        ParentWallet nw = new ParentWallet();
                        nw.setParentEmail(finalEmail);
                        nw.setBalance(0.0);
                        return nw;
                    });
            wallet.setBalance(wallet.getBalance() + amount);
            parentWalletRepository.save(wallet);

            // Log wallet load transaction to MySQL
            SubscriptionPayment payment = new SubscriptionPayment();
            payment.setParentEmail(finalEmail);
            payment.setAmount(amount);
            payment.setPlanType("WALLET_LOAD");
            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setInvoiceNumber("LOAD-" + (orderId != null && orderId.length() >= 8 ? orderId.substring(orderId.length() - 8).toUpperCase() : UUID.randomUUID().toString().substring(0, 8).toUpperCase()));
            subscriptionPaymentRepository.save(payment);

            return ResponseEntity.ok(wallet);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signature verification failed.");
        }
    }

    @PostMapping("/wallet/pay")
    public ResponseEntity<?> payFromWallet(@RequestBody Map<String, Object> requestData) {
        String email = (String) requestData.get("parent_email");
        
        String authenticatedEmail = getAuthenticatedUserEmail();
        if (authenticatedEmail != null && !authenticatedEmail.isEmpty()) {
            email = authenticatedEmail;
        }
        
        Long childId = Long.parseLong(requestData.get("child_id").toString());
        double amount = Double.parseDouble(requestData.get("amount").toString());
        String planType = (String) requestData.get("plan_type");
        String cabId = (String) requestData.get("cab_id");

        Optional<ParentWallet> opWallet = parentWalletRepository.findByParentEmail(email);
        if (opWallet.isEmpty() || opWallet.get().getBalance() < amount) {
            Map<String, String> err = new HashMap<>();
            err.put("status", "FAILED");
            err.put("message", "Insufficient wallet balance.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }

        // Deduct balance
        ParentWallet wallet = opWallet.get();
        wallet.setBalance(wallet.getBalance() - amount);
        parentWalletRepository.save(wallet);

        // Confirm child cab assignment
        Optional<ChildProfile> opChild = childProfileRepository.findById(childId);
        if (opChild.isPresent()) {
            ChildProfile child = opChild.get();
            child.setCabId(cabId);
            child.setVerificationStatus("VERIFIED");
            childProfileRepository.save(child);
        }

        // Log transaction to MySQL
        SubscriptionPayment payment = new SubscriptionPayment();
        payment.setParentEmail(email);
        payment.setChildId(childId);
        payment.setAmount(amount);
        payment.setPlanType(planType != null ? planType.toUpperCase() : "MONTHLY");
        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setInvoiceNumber("WLT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        subscriptionPaymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Payment processed from wallet successfully.");
        response.put("invoiceNumber", payment.getInvoiceNumber());
        response.put("walletBalance", wallet.getBalance());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payment/link")
    public ResponseEntity<?> createPaymentLink(@RequestBody Map<String, Object> requestData, HttpServletRequest request) {
        String callbackHost = request.getHeader("Host");
        if (callbackHost == null) {
            callbackHost = "10.0.2.2:8085";
        }
        try {
            double amount = Double.parseDouble(requestData.get("amount").toString());
            String email = requestData.getOrDefault("email", "priya.sharma@gmail.com").toString();
            int amountInPaise = (int) (amount * 100);

            // Initialize Razorpay Client
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", amountInPaise);
            paymentLinkRequest.put("currency", "INR");
            paymentLinkRequest.put("accept_partial", false);
            paymentLinkRequest.put("description", "SafePassage Wallet Refill");

            JSONObject customer = new JSONObject();
            customer.put("name", "Priya Sharma");
            customer.put("email", email);
            customer.put("contact", "+919999999999");
            paymentLinkRequest.put("customer", customer);

            // Add custom reference parameters in notes
            JSONObject notes = new JSONObject();
            notes.put("parent_email", email);
            notes.put("amount", String.valueOf(amount));
            paymentLinkRequest.put("notes", notes);

            // Redirect back to our callback
            paymentLinkRequest.put("callback_url", "http://" + callbackHost + "/api/parent/payment/callback");
            paymentLinkRequest.put("callback_method", "get");

            com.razorpay.PaymentLink link = razorpay.paymentLink.create(paymentLinkRequest);
            String url = link.get("short_url");

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("paymentUrl", url);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // For mock fallback: return a beautifully styled mock payment checkout URL hosted on our backend
            String mockUrl = "http://" + callbackHost + "/api/parent/payment/mock-checkout?amount=" + requestData.get("amount") + "&email=" + requestData.get("email");
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("paymentUrl", mockUrl);
            response.put("message", "Simulated Checkout Link (Razorpay test key inactive: " + e.getMessage() + ")");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/payment/callback")
    public ResponseEntity<String> paymentCallback(
            @RequestParam(name = "razorpay_payment_id", required = false) String paymentId,
            @RequestParam(name = "razorpay_payment_link_id", required = false) String linkId,
            @RequestParam(name = "razorpay_payment_link_status", required = false) String linkStatus,
            @RequestParam(name = "razorpay_signature", required = false) String signature) {
        
        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            com.razorpay.PaymentLink link = razorpay.paymentLink.fetch(linkId);
            
            JSONObject notes = link.get("notes");
            String email = notes.getString("parent_email");
            double amount = Double.parseDouble(notes.getString("amount"));

            // Refill balance
            ParentWallet wallet = parentWalletRepository.findByParentEmail(email)
                    .orElseGet(() -> {
                        ParentWallet nw = new ParentWallet();
                        nw.setParentEmail(email);
                        nw.setBalance(0.0);
                        return nw;
                    });
            wallet.setBalance(wallet.getBalance() + amount);
            parentWalletRepository.save(wallet);

            // Log payment
            SubscriptionPayment payment = new SubscriptionPayment();
            payment.setParentEmail(email);
            payment.setAmount(amount);
            payment.setPlanType("WALLET_LOAD");
            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setInvoiceNumber("LNK-" + linkId.substring(linkId.length() - 8).toUpperCase());
            subscriptionPaymentRepository.save(payment);

            return ResponseEntity.ok("<html><body style='font-family:sans-serif; text-align:center; padding-top:50px; background:#070b13; color:#fff;'>" +
                    "<h1 style='color:#10b981;'>🎉 Wallet Payment Successful</h1>" +
                    "<p>Your wallet has been credited with ₹" + amount + "</p>" +
                    "<p>You can close this window and return to the app.</p>" +
                    "</body></html>");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Callback error: " + e.getMessage());
        }
    }

    @GetMapping("/payment/mock-checkout")
    @ResponseBody
    public String mockCheckoutPage(@RequestParam String amount, @RequestParam String email, HttpServletRequest request) {
        String callbackHost = request.getHeader("Host");
        if (callbackHost == null) {
            callbackHost = "10.0.2.2:8085";
        }
        return "<html>" +
                "<head>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c101b; color: #fff; margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }" +
                ".card { background-color: #121826; border: 1px solid #1f293d; border-radius: 12px; width: 100%; max-width: 400px; padding: 24px; box-shadow: 0 10px 15px rgba(0,0,0,0.3); }" +
                ".header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1f293d; padding-bottom: 16px; margin-bottom: 20px; }" +
                ".logo { font-size: 18px; font-weight: bold; color: #38bdf8; display: flex; align-items: center; gap: 6px; }" +
                ".badge { background-color: rgba(56,189,248,0.1); color: #38bdf8; font-size: 11px; padding: 4px 8px; border-radius: 12px; font-weight: 500; }" +
                ".amount-label { color: #9ca3af; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }" +
                ".amount-val { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 20px; }" +
                ".option { background-color: #182235; border: 1px solid #23334f; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; }" +
                ".option:hover { border-color: #38bdf8; background-color: #1b283f; }" +
                ".opt-name { font-size: 14px; font-weight: 600; color: #fff; }" +
                ".opt-desc { font-size: 11px; color: #9ca3af; }" +
                ".btn { display: block; width: 100%; background-color: #38bdf8; color: #000; border: none; border-radius: 8px; padding: 14px; font-size: 15px; font-weight: bold; cursor: pointer; text-align: center; text-decoration: none; margin-top: 24px; transition: background-color 0.2s; }" +
                ".btn:hover { background-color: #2bb0eb; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='card'>" +
                "<div class='header'>" +
                "<div class='logo'>💳 Razorpay <span style='font-size:12px; color:#9ca3af;'>Standard</span></div>" +
                "<div class='badge'>TEST MODE</div>" +
                "</div>" +
                "<div class='amount-label'>Amount to Pay</div>" +
                "<div class='amount-val'>₹" + amount + "</div>" +
                "<div class='option'><div class='opt-name'>UPI / QR Code</div><div class='opt-desc'>Google Pay, PhonePe</div></div>" +
                "<div class='option'><div class='opt-name'>Card Payment</div><div class='opt-desc'>Visa, MasterCard, RuPay</div></div>" +
                "<div class='option'><div class='opt-name'>Net Banking</div><div class='opt-desc'>SBI, HDFC, ICICI</div></div>" +
                "<div class='option'><div class='opt-name'>Wallets</div><div class='opt-desc'>Mobikwik, Freecharge</div></div>" +
                "<a class='btn' href='http://" + callbackHost + "/api/parent/payment/mock-callback?amount=" + amount + "&email=" + email + "'>PROCEED & PAY ₹" + amount + "</a>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    @GetMapping("/payment/mock-callback")
    public ResponseEntity<String> mockCallback(@RequestParam String amount, @RequestParam String email) {
        try {
            double amt = Double.parseDouble(amount);
            ParentWallet wallet = parentWalletRepository.findByParentEmail(email)
                    .orElseGet(() -> {
                        ParentWallet nw = new ParentWallet();
                        nw.setParentEmail(email);
                        nw.setBalance(0.0);
                        return nw;
                    });
            wallet.setBalance(wallet.getBalance() + amt);
            parentWalletRepository.save(wallet);

            // Log payment
            SubscriptionPayment payment = new SubscriptionPayment();
            payment.setParentEmail(email);
            payment.setAmount(amt);
            payment.setPlanType("WALLET_LOAD");
            payment.setStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setInvoiceNumber("MCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            subscriptionPaymentRepository.save(payment);

            return ResponseEntity.ok("<html><body style='font-family:sans-serif; text-align:center; padding-top:50px; background:#070b13; color:#fff;'>" +
                    "<h1 style='color:#10b981;'>🎉 Wallet Refill Successful</h1>" +
                    "<p>Your SafePassage wallet has been credited with ₹" + amount + "</p>" +
                    "<p>You can close this window and refresh your app balance.</p>" +
                    "</body></html>");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
