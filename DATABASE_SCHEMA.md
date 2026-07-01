# Kalohouse Property Marketplace - Database Schema Summary

## Overview
Kalohouse uses PostgreSQL as its database with Prisma ORM for data access. The schema is designed to support a trust-first real estate marketplace with verification workflows, role-based access, payment processing, and property management.

## Core Entities

### 1. User (users table)
Central entity representing all system users with role-based differentiation.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `email`: String (Unique)
- `emailVerified`: DateTime (Nullable)
- `password`: String (Nullable for OAuth users)
- `full_name`: String
- `role`: Enum (ADMIN, AGENT, OWNER, CLIENT) - Default: CLIENT
- `is_active`: Boolean - Default: true
- `is_verified`: Boolean - Default: false
- `nationality`: String (Nullable)
- `national_id`: String (Nullable)
- `sector_id`: Integer (Foreign Key to sectors table, Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `owned_properties`: One-to-Many (User → Property as owner)
- `assigned_properties`: One-to-Many (User → Property as assigned agent)
- `uploaded_media`: One-to-Many (User → PropertyMedia)
- `payments`: One-to-Many (User → Payment as client)
- `visits`: One-to-Many (User → VisitRequest)
- `refunds`: One-to-Many (User → Refund)
- `payouts`: One-to-Many (User → Payout)
- `created_invites`: One-to-Many (User → AgentInvite)
- `verifications`: One-to-Many (User → Verification as agent)
- `accounts`: One-to-Many (User → Account for OAuth)
- `sessions`: One-to-Many (User → Session)

### 2. Sector (sectors table)
Geographic divisions of Kigali for agent assignment and property organization.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `district`: String
- `name`: String
- `created_at`, `updated_at`: DateTime timestamps
- **Unique Constraint**: (`district`, `name`) - Ensures no duplicate sector names within districts

**Relationships:**
- `agents`: One-to-Many (Sector → Users with agent role)
- `properties`: One-to-Many (Sector → Properties)
- `invites`: One-to-Many (Sector → AgentInvite)

### 3. Property (properties table)
Core entity representing real estate listings with comprehensive verification and status tracking.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `title`: String
- `description`: Text
- `purpose`: Enum (RENT, SALE)
- `district`: String (Denormalized for performance)
- `sector_id`: Integer (Foreign Key to sectors)
- `sector`: String (Denormalized sector name)
- `city`: String - Default: "Kigali"
- `cell`, `village`, `street`: String (Nullable)
- `address`: String
- `property_type`: String (e.g., "Apartment", "House", "Villa")
- `bedrooms`, `bathrooms`, `kitchens`: Integer
- `living_rooms`: Integer - Default: 1
- `size_sq_m`: Decimal(10,2) (Nullable)
- `parking_capacity`: Integer - Default: 0

**Security Features:**
- `has_fence`: Boolean - Default: false
- `has_cctv`: Boolean - Default: false
- `has_security_guard`: Boolean - Default: false
- `is_gated_community`: Boolean - Default: false

**Internet Features:**
- `has_fiber`: Boolean - Default: false
- `has_canalbox`: Boolean - Default: false
- `other_internet`: String (Nullable)

**Owner Trust Info:**
- `owner_full_name`: String (Nullable)
- `owner_phone`: String (Nullable)
- `owner_whatsapp`: String (Nullable)
- `owner_email`: String (Nullable)
- `owner_alt_phone`: String (Nullable)
- `owner_id_url`: String (Nullable)
- `is_owner_verified`: Boolean - Default: false

**Financial Information:**
- `owner_price`: Decimal(12,2) - Amount owner receives
- `commission_rate`: Decimal(5,4) - Platform commission percentage
- `commission_amount`: Decimal(12,2) - Calculated commission
- `final_display_price`: Decimal(12,2) - Total displayed price
- `contact_info`: Text

**Location & Mapping:**
- `location`: String (Variable length up to 500 chars)
- `latitude`: Decimal(10,8) (Nullable)
- `longitude`: Decimal(11,8) (Nullable)

**Status & Workflow:**
- `status`: Enum (PENDING_VERIFICATION, AGENT_ASSIGNED, VERIFIED, PUBLISHED, REJECTED, RESERVED, PAID, COMPLETED) - Default: PENDING_VERIFICATION
- `owner_id`: Integer (Foreign Key to users)
- `assigned_agent_id`: Integer (Foreign Key to users, Nullable)
- `rejection_reason`: Text (Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `owner`: One-to-One (Property → User as owner)
- `assigned_agent`: One-to-One (Property → User as agent, Nullable)
- `sector_ref`: One-to-One (Property → Sector)
- `media`: One-to-Many (Property → PropertyMedia)
- `verification`: One-to-One (Property → Verification, Nullable)
- `payments`: One-to-Many (Property → Payment)
- `visits`: One-to-Many (Property → VisitRequest)
- `refunds`: One-to-Many (Property → Refund)
- `payouts`: One-to-Many (Property → Payout)

### 4. PropertyMedia (property_media table)
Media assets associated with properties (images and videos).

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `property_id`: Integer (Foreign Key to properties)
- `uploaded_by_id`: Integer (Foreign Key to users)
- `media_type`: Enum (IMAGE, VIDEO)
- `url`: String (Storage path or CDN URL)
- `storage_provider`: String - Default: "local"
- `public_id`: String (Nullable, for cloud storage identifiers)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `property`: One-to-One (PropertyMedia → Property)
- `uploaded_by`: One-to-One (PropertyMedia → User)

### 5. Verification (verifications table)
Agent verification records for properties.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `property_id`: Integer (Foreign Key to properties, Unique)
- `agent_id`: Integer (Foreign Key to users)
- `notes`: Text (Nullable)
- `status`: Enum (PENDING, APPROVED, REJECTED) - Default: PENDING
- `rejection_reason`: Text (Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `property`: One-to-One (Verification → Property)
- `agent`: One-to-One (Verification → User)

### 6. Payment (payments table)
Financial transactions for property reservations/purchases.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `property_id`: Integer (Foreign Key to properties)
- `client_id`: Integer (Foreign Key to users)
- `amount`: Decimal(12,2)
- `status`: Enum (PENDING, PAID, FAILED, REFUNDED) - Default: PENDING
- `provider`: String - Default: "simulated"
- `provider_reference`: String (Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `property`: One-to-One (Payment → Property)
- `client`: One-to-One (Payment → User)
- `visit`: One-to-One (Payment → VisitRequest, Nullable)
- `refund`: One-to-One (Payment → Refund, Nullable)
- `payout`: One-to-One (Payment → Payout, Nullable)

### 7. Payout (payouts table)
Owner disbursements after successful transactions.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `property_id`: Integer (Foreign Key to properties)
- `owner_id`: Integer (Foreign Key to users)
- `payment_id`: Integer (Foreign Key to payments, Unique)
- `amount`: Decimal(12,2)
- `status`: Enum (PENDING, COMPLETED, FAILED) - Default: PENDING
- `provider_reference`: String (Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `property`: One-to-One (Payout → Property)
- `owner`: One-to-One (Payout → User)
- `payment`: One-to-One (Payout → Payment)

### 8. Refund (refunds table)
Client reimbursements for cancelled visits.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `property_id`: Integer (Foreign Key to properties)
- `payment_id`: Integer (Foreign Key to payments, Unique)
- `client_id`: Integer (Foreign Key to users)
- `amount`: Decimal(12,2)
- `status`: Enum (REQUESTED, APPROVED, REJECTED, COMPLETED) - Default: REQUESTED
- `reason`: Text (Nullable)
- `admin_note`: Text (Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `property`: One-to-One (Refund → Property)
- `payment`: One-to-One (Refund → Payment)
- `client`: One-to-One (Refund → User)

### 9. VisitRequest (visit_requests table)
Scheduled property visits by clients after payment.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `property_id`: Integer (Foreign Key to properties)
- `client_id`: Integer (Foreign Key to users)
- `payment_id`: Integer (Foreign Key to payments, Unique, Nullable)
- `status`: Enum (PENDING_PAYMENT, SCHEDULED, VISITED, ACCEPTED, CANCELLED) - Default: PENDING_PAYMENT
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `property`: One-to-One (VisitRequest → Property)
- `client`: One-to-One (VisitRequest → User)
- `payment`: One-to-One (VisitRequest → Payment, Nullable)

### 10. AgentInvite (agent_invites table)
Invitation system for onboarding new agents.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `email`: String
- `name`: String (Nullable)
- `token`: String (Unique)
- `status`: Enum (PENDING, USED, EXPIRED) - Default: PENDING
- `sector_id`: Integer (Foreign Key to sectors)
- `created_by_id`: Integer (Foreign Key to users)
- `expires_at`: DateTime
- `used_at`: DateTime (Nullable)
- `created_at`, `updated_at`: DateTime timestamps

**Relationships:**
- `sector`: One-to-One (AgentInvite → Sector)
- `created_by`: One-to-One (AgentInvite → User)

### 11. Authentication Tables (NextAuth)

#### Account (accounts table)
OAuth account connections.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `userId`: Integer (Foreign Key to users)
- `type`: String
- `provider`: String
- `providerAccountId`: String
- `refresh_token`: Text (Nullable)
- `access_token`: Text (Nullable)
- `expires_at`: Integer (Nullable)
- `token_type`: String (Nullable)
- `scope`: String (Nullable)
- `id_token`: Text (Nullable)
- `session_state`: String (Nullable)
- **Unique Constraint**: (`provider`, `providerAccountId`)

**Relationship:**
- `user`: One-to-One (Account → User)

#### Session (sessions table)
User session records.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `sessionToken`: String (Unique)
- `userId`: Integer (Foreign Key to users)
- `expires`: DateTime
- **Relationship:**
- `user`: One-to-One (Session → User)

#### VerificationToken (verification_tokens table)
Email verification and password reset tokens.

**Key Fields:**
- `identifier`: String
- `token`: String (Unique)
- `expires`: DateTime
- **Unique Combination**: (`identifier`, `token`)

### 12. CommissionSetting (commission_settings table)
Platform commission configuration.

**Key Fields:**
- `id`: Integer (Primary Key, Auto-increment)
- `rate`: Decimal(5,4)
- `is_active`: Boolean - Default: true
- `created_at`, `updated_at`: DateTime timestamps

## Key Design Patterns & Constraints

### Denormalization for Performance
- `district` and `sector` fields in Property table are duplicated from Sector table for faster querying without joins
- Trade-off: Slightly increased storage for improved read performance

### Status-Driven Workflows
- Property status flows: PENDING_VERIFICATION → AGENT_ASSIGNED → VERIFIED → PUBLISHED → [RESERVED/PAID] → COMPLETED
- Payment status: PENDING → PAID → [REFUNDED] or → PAID → [REFUNDED]
- Refund status: REQUESTED → APPROVED/REJECTED → COMPLETED
- Visit status: PENDING_PAYMENT → SCHEDULED → VISITED → ACCEPTED/CANCELLED

### Referential Integrity
- Foreign key constraints with CASCADE deletes where appropriate (e.g., deleting a property deletes its media, verifications, etc.)
- Unique constraints prevent duplicate emails, agent invite tokens, etc.

### Security Considerations
- Passwords stored as hashes (via bcrypt in auth.ts)
- Email verification required for credential authentication
- Role-based access controlled at application level
- Sensitive owner information optionally provided for verification

### Financial Tracking
- Complete transaction trail from payment → payout/refund
- Commission calculated and stored at time of listing creation
- Clear separation between owner proceeds and platform revenue

## Indexing Strategy (Inferred from Schema)
Primary indexes on all `id` fields
Foreign key indexes on all relation fields
Unique indexes on:
- `users.email`
- `users.email_verification_token_hash`
- `users.password_reset_token_hash`
- `sectors.district` + `sectors.name`
- `properties.property_id` in verification table (one verification per property)
- `payments.payment_id` in refund table (one refund per payment)
- `payments.payment_id` in payout table (one payout per payment)
- `accounts.provider` + `accounts.providerAccountId`
- `sessions.sessionToken`
- `verification_tokens.identifier` + `verification_tokens.token`
- `agent_invites.token`

## Extensibility Points
1. **Additional Property Fields**: Easy to add new property characteristics
2. **Media Types**: PropertyMediaType enum can be extended
3. **Workflow States**: Status enums can be extended with new states
4. **Payment Providers**: Provider field allows integration with real payment gateways
5. **Storage Providers**: Storage_provider field supports multiple backends (local, AWS, Cloudinary, etc.)
6. **Commission Structure**: CommissionSetting table allows dynamic rate changes

## Scalability Considerations
1. **Partitioning**: Properties table could be partitioned by sector or status for large datasets
2. **Caching**: Frequently accessed property listings suitable for Redis caching
3. **Read Replicas**: Separate read/write workloads for high traffic
4. **Archiving**: Old completed transactions could be archived to separate tables/storage