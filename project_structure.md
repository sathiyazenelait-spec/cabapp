# School & College Cab Management System - Project Architecture

This project is a multi-role cab management and route optimization marketplace targeting parents, school students, college students, working professionals, independent drivers, cab owners, and super admins.

## Repository & Directory Structure

```text
/school_college_cab_management_software
  ├── project_structure.md        # This architecture overview file
  │
  ├── frontend-mobile/            # React Native (TypeScript) Mobile App
  │   ├── src/
  │   │   ├── components/         # Shared UI controls (Paper/NativeWind)
  │   │   ├── screens/            # Screens for Parents, Drivers, Students, etc.
  │   │   ├── store/              # Redux Toolkit Global State
  │   │   └── navigation/         # React Navigation stacks
  │   ├── App.tsx                 # App main controller
  │   └── package.json
  │
  ├── web-prototype/              # Interactive High-Fidelity Web Simulator (Vite + React)
  │
  └── backends/                   # Microservice Backends (Java + Spring Boot)
      ├── backend-super-admin/    # Super Admin Service (Verification, Analytics, Disputes, Offers)
      ├── backend-parent/         # Parent Service (Children profiles, Subscription billing, Notifications)
      ├── backend-cab-owner/      # Cab Owner Service (Fleet management, seat listing, earnings)
      ├── backend-driver/         # Driver Service (Trip status, live GPS, student check-in checklist)
      └── backend-student-work/   # Student/Professional Service (Route matching, booking, payment logs)
```

## Backend Technology Architecture (Spring Boot)

Each service in `backends/` is designed as a standalone Spring Boot application, operating under the following paradigm:

1. **Security**: Spring Security configured with JWT authentication token validation.
2. **Database**: MySQL/PostgreSQL as the core transactional store.
3. **Caching**: Redis for session tokens, location caching, and lock mechanisms (prevent double-booking empty seats).
4. **Storage**: AWS S3 integration via AWS Java SDK for uploading vehicle registration, driver KYC (Aadhar/Licenses), and student passport photos.
5. **Messaging**: Firebase Cloud Messaging (FCM) to trigger instant alerts:
   - "Child Boarded" / "Child Dropped Safe"
   - "Emergency SOS Triggered"
   - "Near Location Alert" (within 0.5 miles)
6. **API Specs**: Swagger/OpenAPI interactive web client enabled at `/swagger-ui/index.html`.

## Getting Started

### Backend Setup
To run any of the backends, navigate to the specific service directory:
```bash
cd backends/backend-super-admin
./mvnw spring-boot:run
```

Ensure you have your environment properties specified in `src/main/resources/application.yml` for DB connection pool, AWS configurations, and Redis connection setup.
