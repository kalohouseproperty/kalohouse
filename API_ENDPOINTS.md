# Kalohouse Property Marketplace - API Endpoints

## Overview
This document outlines all API endpoints available in the Kalohouse Property Marketplace application, organized by feature area.

## Authentication Endpoints (NextAuth)
All authentication endpoints are handled by NextAuth.js under `/api/auth/*`:

- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signout` - Sign out endpoint
- `GET /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/callback/credentials` - Credentials provider callback
- `GET /api/auth/session` - Get session data
- `GET /api/auth/csrf` - CSRF token
- `GET /api/auth/providers` - List configured providers

## Property Endpoints

### Property Management
- `GET /api/properties` - List all published properties (with filters)
  - Query params: `purpose`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `sector`, `page`, `limit`
- `GET /api/properties/[id]` - Get property details by ID
- `POST /api/properties` - Create new property (Owner/Agent only)
  - Body: Property creation data
- `PUT /api/properties/[id]` - Update property (Owner only)
  - Body: Property update data
- `DELETE /api/properties/[id]` - Delete property (Owner only)
- `POST /api/properties/[id]/media` - Upload media for property (Agent/Owner)
  - Body: File upload data
- `DELETE /api/properties/[id]/media/[mediaId]` - Delete property media

### Property Verification
- `POST /api/verifications` - Submit property verification (Agent only)
  - Body: `{ propertyId, notes, status }`
- `GET /api/verifications/property/[propertyId]` - Get verification for property
- `PUT /api/verifications/[id]` - Update verification status (Admin/Agent)
  - Body: `{ status, rejectionReason }`

## Dashboard Endpoints (Protected)

### Admin Dashboard
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - List all users (with pagination/filters)
- `PUT /api/admin/users/[id]/role` - Update user role
- `PUT /api/admin/users/[id]/status` - Update user active status
- `GET /api/admin/sectors` - List all sectors
- `POST /api/admin/sectors` - Create new sector
- `PUT /api/admin/sectors/[id]` - Update sector
- `DELETE /api/admin/sectors/[id]` - Delete sector
- `GET /api/admin/agent-invites` - List agent invitations
- `POST /api/admin/agent-invites` - Create agent invitation
- `PUT /api/admin/agent-invites/[id]/status` - Update invitation status
- `GET /api/admin/commission-settings` - Get commission settings
- `PUT /api/admin/commission-settings` - Update commission rate

### Agent Dashboard
- `GET /api/agent/properties` - Get properties assigned to agent
- `GET /api/agent/verifications` - Get verification requests for agent
- `GET /api/agent/sector` - Get agent's assigned sector
- `GET /api/agent/visits` - Get visit requests for agent's properties
- `PUT /api/agent/visits/[id]/schedule` - Schedule a visit
  - Body: `{ date, time }`

### Owner Dashboard
- `GET /api/owner/properties` - Get properties owned by user
- `GET /api/owner/payouts` - Get payout history
- `GET /api/owner/payouts/[id]` - Get specific payout details
- `GET /api/owner/properties/[id]/analytics` - Get property analytics
- `POST /api/owner/properties/[id]/toggle-publish` - Toggle property publish status

### Client Dashboard
- `GET /api/client/favorites` - Get user's favorite properties
- `POST /api/client/favorites` - Add property to favorites
- `DELETE /api/client/favorites/[id]` - Remove property from favorites
- `GET /api/client/visits` - Get user's visit requests
- `POST /api/client/visits` - Create new visit request
- `PUT /api/client/visits/[id]/status` - Update visit request status
- `GET /api/client/payments` - Get user's payment history
- `GET /api/client/profile` - Get user profile
- `PUT /api/client/profile` - Update user profile

## Payment Endpoints

- `POST /api/payments` - Create new payment
  - Body: `{ propertyId, amount }`
- `GET /api/payments/[id]` - Get payment details
- `PUT /api/payments/[id]/status` - Update payment status (Webhook)
  - Body: `{ status, providerReference }`
- `GET /api/payments` - Get payments (with filters for admin)
- `POST /api/payments/[id]/refund` - Initiate refund
  - Body: `{ amount, reason }`

## Visit Request Endpoints

- `POST /api/visit-requests` - Create visit request (after payment)
  - Body: `{ propertyId, preferredDate, preferredTime }`
- `GET /api/visit-requests/[id]` - Get visit request details
- `PUT /api/visit-requests/[id]/status` - Update visit request status
  - Body: `{ status: SCHEDULED|VISITED|ACCEPTED|CANCELLED }`
- `GET /api/visit-requests` - Get visit requests (with filters for agents/owners)

## Refund Endpoints

- `POST /api/refunds` - Create refund request
  - Body: `{ paymentId, reason }`
- `GET /api/refunds/[id]` - Get refund details
- `PUT /api/refunds/[id]/status` - Update refund status (Admin)
  - Body: `{ status: APPROVED|REJECTED, adminNote }`
- `GET /api/refunds` - Get refunds (with filters)

## Payout Endpoints

- `GET /api/payouts` - Get payouts (with filters for admin/owners)
- `GET /api/payouts/[id]` - Get payout details
- `PUT /api/payouts/[id]/status` - Update payout status
  - Body: `{ status: COMPLETED|FAILED, providerReference }`

## Sector Endpoints

- `GET /api/sectors` - List all sectors
- `GET /api/sectors/[id]` - Get sector details
- `GET /api/sectors/[id]/properties` - Get properties in sector
- `GET /api/sectors/[id]/agents` - Get agents assigned to sector

## Utility Endpoints

- `GET /api/db-test` - Database connection test
- `GET /api/health` - Health check endpoint
- `GET /api/stats` - Public platform statistics

## Webhook Endpoints

- `POST /api/webhooks/payment` - Payment provider webhook
- `POST /api/webhooks/refund` - Refund provider webhook
- `POST /api/webhooks/payout` - Payout provider webhook

## Error Response Format
All API endpoints return errors in this format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

## Success Response Format
Successful responses typically return:
```json
{
  "success": true,
  "data": {} // Response data varies by endpoint
}
```

For list endpoints:
```json
{
  "success": true,
  "data": [], // Array of items
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Authentication Middleware
Dashboard routes are protected by custom middleware in `proxy.ts` which:
- Checks for valid session via `getServerSession()`
- Returns 401 Unauthorized for unauthenticated access to `/dashboard/*` paths
- Allows auth pages (`/auth/*`) to be publicly accessible
- Individual API routes may implement additional role-based checks

## Rate Limiting
While not explicitly shown in the codebase, production implementation should consider:
- Rate limiting on authentication endpoints
- Rate limiting on payment processing endpoints
- Rate limiting on file upload endpoints
- Specific limits for admin operations to prevent abuse

## Security Considerations
- All endpoints should validate and sanitize input data
- Authentication required for all non-public endpoints
- Role-based access control enforced at route level
- HTTPS required for all API calls in production
- CSRF protection for state-changing operations
- Input validation to prevent injection attacks
- Proper error handling to avoid information leakage