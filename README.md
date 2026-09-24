# SafePassage AI - School & College Cab Management System

SafePassage AI is a comprehensive multi-role cab management, route optimization, and student safety platform.

## Key Modules & Roles
1. **Parent Portal & Mobile App**: Real-time school bus tracking, boarding/deboarding alerts, live GPS, and emergency SOS alerts.
2. **Student & Professional Commute App**: Intelligent route matching, digital QR pass, seat booking, and attendance.
3. **Driver & Fleet Operator Cockpit**: Student checklist, turn-by-turn navigation, SOS trigger, and automated earnings calculation.
4. **Super Admin Web Portal**: Fleet monitoring, verification, dispute management, subscription billing, and real-time live map.
5. **Common App Download Hub**: Responsive mobile landing page for one-click APK downloads and installation.

## Project Architecture
- **Web Portal & Download Hub**: React 18, Vite, TypeScript, TailwindCSS / Lucide Icons
- **Mobile Applications**: React Native (Android & iOS)
- **Backend Microservices**: Java 17/21, Spring Boot 3, Spring Security, JWT, Maven
- **Database & Cache**: PostgreSQL / MySQL, Redis
- **Cloud Storage & Push Notifications**: AWS S3 / Cloudflare R2, Firebase Cloud Messaging (FCM)

## Getting Started

### 1. Web Portal & Download Hub
```bash
cd web-prototype
npm install
npm run dev
```

### 2. Spring Boot Microservices
Navigate to any service in `backends/` (e.g., `backend-super-admin`, `backend-parent`, `backend-driver`, etc.):
```bash
cd backends/backend-super-admin
./mvnw spring-boot:run
```

### 3. Build Standalone Mobile APKs
```powershell
.\build_all_release_apks.ps1 -TargetApp all
```
