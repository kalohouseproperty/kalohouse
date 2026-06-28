# Kalohouse Property Marketplace - Architecture Diagram

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User Devices                               │
│                                                                     │
│  • Modern Web Browsers (Chrome, Firefox, Safari, Edge)             │
│  • Mobile Devices (Responsive Design)                              │
│  • Authenticated Sessions via NextAuth.js (JWT)                    │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼ HTTPS (Secure HTTP/2)
┌─────────────────────────────────────────────────────────────────────┐
│                         Edge/CDN Layer                             │
│  (Vercel Platform - Automatic SSL, Global CDN, Edge Functions)     │
│                                                                     │
│  • Static Asset Serving (CSS, JS, Images)                          │
│  • API Route Handling (Next.js API Routes)                         │
│  • Server-Side Rendering (SSR) & Static Generation (SSG)           │
│  • Authentication Middleware (NextAuth)                            │
│  • Request/Response Transformation                                 │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼ Application Logic
┌─────────────────────────────────────────────────────────────────────┐
│                           Next.js Application                       │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                 Presentation Layer                          │  │  │
│  │                                                             │  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │              React Components (Client & Server)     │  │  │  │
│  │  │                                                     │  │  │  │
│  │  │  • UI Components (shadcn/ui)                        │  │  │  │
│  │  │  • Property Cards, Forms, Dashboards                │  │  │  │
│  │  │  • Interactive Maps (Leaflet)                       │  │  │  │
│  │  │  • Authentication Forms & Flows                     │  │  │  │
│  │  │  • Role-Based Views (Admin, Agent, Owner, Client)   │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  │                                                             │  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │              Application Logic Layer                │  │  │  │
│  │  │                                                     │  │  │  │
│  │  │  • Server Actions & API Routes                      │  │  │  │
│  │  │  • Business Logic (Property Verification, etc.)     │  │  │  │
│  │  │  • Payment Processing Simulation                    │  │  │  │
│  │  │  • Role-Based Access Control (RBAC)                 │  │  │  │
│  │  │  • Data Validation & Transformation                 │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  │                                                             │  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │              Data Access Layer                      │  │  │  │
│  │  │                                                     │  │  │  │
│  │  │  • Prisma ORM Client                                │  │  │  │
│  │  │  • Database Queries & Mutations                     │  │  │  │
│  │  │  • Transaction Handling                             │  │  │  │
│  │  │  • Relation Management                              │  │  │  │
│  │  │  └─────────────────────────────────────────────────┘  │  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                   Authentication System                     │  │  │
│  │  (NextAuth.js with Google & Credentials Providers)          │  │  │
│  │                                                             │  │  │
│  │  • JWT Session Management                                   │  │  │
│  │  • OAuth 2.0 (Google)                                       │  │  │
│  │  • Email/Password Authentication                            │  │  │
│  │  • Prisma Adapter for Session Storage                       │  │  │
│  │  • Email Verification & Password Reset                      │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    API Protection Layer                     │  │  │
│  │                     (proxy.ts middleware)                   │  │  │
│  │                                                             │  │  │
│  │  • Route Protection for /dashboard/* paths                  │  │  │
│  │  • Ensures authenticated access to protected routes         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
└─────────────────┬───────────────────────────────────────────────────┘
                  │
                  ▼ PostgreSQL Database Connection
┌─────────────────────────────────────────────────────────────────────┐
│                            Database Layer                           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                   Prisma Schema Models                      │  │  │
│  │                                                             │  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │                         Users                       │  │  │  │
│  │  │                                                     │  │  │  │
│  │  │  • id, email, role, sector_id, etc.                 │  │  │  │
│  │  │  • Authentication fields (password, tokens)         │  │  │  │
│  │  │  • Relations to properties, media, payments, etc.   │  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │  │
│  │                                                             │  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │                       Properties                    │  │  │  │
│  │  │                                                     │  │  │  │
│  │  │  • Core property information                        │  │  │  │
│  │  │  • Status tracking (pending → verified → published) │  │  │  │
│  │  │  • Price, commission, location data                 │  │  │  │
│  │  │  • Security & internet features                     │  │  │  │
│  │  │  • Relations to owner, agent, media, etc.           │  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │  │
│  │                                                             │  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │  │
│  │  │                  Related Entities                   │  │  │  │
│  │  │                                                     │  │  │  │
│  │  │  • PropertyMedia (images/video)                     │  │  │  │
│  │  │  • Verifications (agent notes/approval)             │  │  │  │
│  │  │  • Payments, Refunds, Payouts                       │  │  │  │
│  │  │  • VisitRequests                                    │  │  │  │
│  │  │  • AgentInvites                                     │  │  │  │
│  │  │  • Sectors                                          │  │  │  │
│  │  │  • CommissionSettings                               │  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### Property Submission Flow
```
User Submission
        │
        ▼
[Client-Side Form Validation]
        │
        ▼
[Next.js Route Handler: /app/properties/page.tsx]
        │
        ▼
[Prisma Creation: prisma.property.create()]
        │
        ▼
[Database: Insert into "properties" table]
        │
        ▼
[Success Response → Redirect to Dashboard]
```

### Property Verification Flow
```
Agent Uploads Media
        │
        ▼
[API Route: /app/api/properties/[id]/media]
        │
        ▼
[Media Upload to Storage]
        │
        ▼
[Database Update: property_media table]
        │
        ▼
[Agent Submits Verification Form]
        │
        ▼
[API Route: /app/api/verifications]
        │
        ▼
[Database: Insert/update verifications table]
        │
        ▼
[Property Status Update: verified → published]
        │
        ▼
[Notification System (if implemented)]
```

### Payment Flow
```
Client Selects Property
        │
        ▼
[Calculate Total: owner_price + commission]
        │
        ▼
[Create Payment Record: pending status]
        │
        ▼
[Redirect to Payment Gateway (Simulated)]
        │
        ▼
[Webhook/Polling: Payment Status Update]
        │
        ▼
[Database: Update payment.paid status]
        │
        ▼
[Create VisitRequest: pending_payment]
        │
        ▼
[Agent Notification for Visit Scheduling]
```

## Key Architectural Characteristics

1. **Hybrid Rendering**: Combines Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR) based on route requirements

2. **Authentication-First**: NextAuth.js integrates deeply with Prisma for secure session management

3. **Role-Based Access Control**: Dashboard routes and API endpoints protected by user roles (admin, agent, owner, client)

4. **API Route Protection**: Custom middleware (proxy.ts) protects /dashboard/* routes

5. **ORM-Based Data Access**: Prisma provides type-safe database interactions with automatic migrations

6. **Modular Component Architecture**: Reusable UI components organized by function (cards, forms, layout, etc.)

7. **Edge-Optimized**: Designed for Vercel deployment with automatic scaling and global distribution

8. **Security-Focused**: Prepared for HTTPS, role validation, and secure authentication flows

## Technology Stack Details

- **Frontend Framework**: Next.js 13.4+ (App Router with Server Components)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Authentication**: NextAuth.js with Prisma Adapter
- **Database**: PostgreSQL via Prisma ORM
- **ORM**: Prisma Client with PostgreSQL adapter
- **Mapping**: Leaflet.js for interactive property maps
- **State Management**: React Context + Server Actions
- **Deployment**: Vercel (serverless functions + edge network)
- **Build System**: Next.js built-in compiler (SWC)
- **Form Handling**: React Hook Form (inferred from components)
- **Validation**: Zod (inferred from Prisma integration)