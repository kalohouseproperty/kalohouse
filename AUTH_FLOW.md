# Kalohouse Property Marketplace - Authentication Flow

## Overview
Kalohouse implements a robust authentication system using NextAuth.js with support for Google OAuth and email/password credentials. The system integrates with Prisma ORM for secure user management and session handling.

## Authentication Providers

### 1. Google OAuth Provider
- Uses standard OAuth 2.0 flow
- Requires `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` environment variables
- Automatically verifies email addresses upon successful login
- Maps Google profile data to local user fields

### 2. Credentials Provider (Email/Password)
- Custom implementation using bcrypt for password hashing
- Requires email verification before allowing login
- Handles local account creation and management

## Authentication Flow Details

### User Registration Flow

#### Via Google OAuth
1. User clicks "Sign in with Google"
2. Browser redirected to Google OAuth consent screen
3. User grants permission to access email and profile info
4. Google redirects back to `/api/auth/callback/google` with authorization code
5. NextAuth exchanges code for access token and retrieves user profile
6. System checks if user exists by email:
   - If exists and email not verified: Updates `emailVerified` and sets `is_verified = true`
   - If exists and already verified: Proceeds to session creation
   - If does not exist: Creates new user with Google profile data
7. Creates encrypted JWT session cookie
8. Redirects to callback URL or default page

#### Via Email/Password
1. User submits registration form with email and password
2. [Application-level validation occurs - not shown in auth.ts]
3. System creates user record with:
   - Hashed password (bcrypt)
   - `emailVerified` set to null
   - `is_verified` set to false
   - Email verification token generated
4. Sends verification email to user
5. User must verify email before being able to log in

### Login Flow

#### Google OAuth Login
1. Same as registration flow above
2. Existing verified users proceed directly to session creation
3. Session JWT created and returned

#### Email/Password Login
1. User submits login form with email and password
2. NextAuth credentials provider activated:
   - Validates email and password are provided
   - Searches for user by email
   - Returns null if user not found, password missing, or email not verified
   - Compares provided password hash with stored hash using bcrypt
   - Returns null if passwords don't match
3. On success, returns user object with:
   - `id`: User ID as string
   - `email`: User email
   - `name`: User full name
   - `role`: User role from database
4. NextAuth creates encrypted JWT session
5. Redirects to callback URL or default page

### Session Management

#### Session Creation
- Uses JWT strategy (tokens stored in encrypted cookie)
- Session lifetime: Default NextAuth settings (typically 1 day)
- `jwt` callback enriches token with:
  - `token.id`: User ID
  - `token.email`: User email
  - `token.name`: User name (from user or full_name)
  - `token.role`: User role (defaults to "client" if not set)

#### Session Validation
- On each request, NextAuth:
  - Decrypts and validates JWT cookie
  - Checks token expiration
  - Runs `session` callback to attach token data to session object
  - Makes session available via `getServerSession()` or `useSession()`

#### Session Customization
- `session` callback copies `token.role` to `session.user.role` for easy access
- `token.id` mapped to `session.user.id`
- Other user data preserved from token

### Special Authentication Features

#### Email Verification Handling
- In Google OAuth `signIn` callback:
  - If user signs in with Google and has unverified email:
    - Sets `emailVerified` to current date
    - Sets `is_verified` to true
  - This ensures Google users start with verified email status

#### Email Verification & Password Reset
- Uses built-in NextAuth verification token system
- `VerificationToken` table stores:
  - `identifier`: Email address or reset token type
  - `token`: Secure random token
  - `expires`: Expiration datetime
- Standard NextAuth routes:
  - `/api/auth/verify-request` - Email verification
  - `/api/auth/reset-password` - Password reset

#### Route Protection
- Custom middleware in `proxy.ts` protects `/dashboard/*` routes
- Returns 401 or redirects to login for unauthenticated attempts
- Individual pages and API routes implement additional role checks
- Auth pages (`/auth/*`) are publicly accessible

#### Role-Based Access Control (RBAC)
- Authentication provides `role` in user token
- Application checks role before allowing access to:
  - Admin-only features (user management, system settings)
  - Agent-only features (property verification, sector assignments)
  - Owner-only features (property management, payout tracking)
  - Client-only features (property browsing, payments, visits)

### Security Considerations

#### Password Security
- Passwords hashed using bcrypt with salt rounds
- Never stored or transmitted in plain text
- Minimum length and complexity enforced at form level

#### Session Security
- JWT tokens encrypted with server secret (`AUTH_SECRET`)
- Secure cookies in production (HTTPS only)
- Protection against XSS via HttpOnly cookie flags
- CSRF protection via NextAuth built-in mechanisms

#### OAuth Security
- State parameter used to prevent CSRF in OAuth flow
- PKCE not explicitly shown but may be implied in NextAuth implementation
- Token expiration handled by Google OAuth

#### Email Security
- Rate limiting on verification emails (application level)
- Token-based verification prevents account takeover
- Expired tokens automatically cleaned by Prisma

#### Account Enumeration Protection
- Login flow returns generic errors for:
  - Non-existent email
  - Incorrect password
  - Unverified email
- Prevents attackers from determining valid email addresses

### Token & Session Structure

#### JWT Token Contents
After `jwt` callback:
```
{
  "id": "user_id_as_string",
  "email": "user@example.com",
  "name": "Full Name or email prefix",
  "role": "admin|agent|owner|client",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp",
  "jti": "jwt_id"
}
```

#### Session Object
After `session` callback:
```
{
  "user": {
    "id": "user_id_as_string",
    "email": "user@example.com",
    "name": "Full Name",
    "role": "admin|agent|owner|client"
  },
  "expires": "session_expiration_iso_string",
  // ... other NextAuth session properties
}
```

### Environment Variables Required
```
AUTH_SECRET=32+_character_random_string
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
# Optional for development:
# AUTH_SECRET defaults to "dev-auth-secret-change-me" in development
```

### Endpoints Exposed by NextAuth
All under `/api/auth/*`:
- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out endpoint
- `/api/auth/callback/google` - Google OAuth callback
- `/api/auth/callback/credentials` - Credentials provider callback
- `/api/auth/session` - Get session data
- `/api/auth/csrf` - CSRF token
- `/api/auth/providers` - List configured providers
- Error handling pages (configurable)

### Integration with Application

#### Client-Side Usage
```typescript
import { useSession, signIn, signOut } from "next-auth/react";

function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not signed in</p>;
  
  return <p>Signed in as {session.user.name} ({session.user.role})</p>;
}
```

#### Server-Side Usage
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Access session.user.id, session.user.role, etc.
  return Response.json({ user: session.user });
}
```

#### Route Protection Examples
In `app/(protected)/layout.tsx` or page files:
```typescript
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function ProtectedLayout() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth");
  }
  
  // Additional role checks:
  // if (session.user.role !== "admin") redirect("/unauthorized");
  
  return <main>{children}</main>;
}
```

## Authentication Lifecycle

1. **Anonymous User**
   - Visits public pages (/ , /properties, /about)
   - Sees "Sign In" button
   - No session cookie

2. **Authentication Process**
   - Chooses Google or Email/Password
   - Completes auth flow
   - Receives encrypted JWT cookie
   - Redirected to intended destination

3. **Authenticated User**
   - Has valid session cookie
   - Can access protected routes based on role
   - Session validated on each server request
   - Can access user data via `useSession()` or `getServerSession()`

4. **Session Expiry**
   - Cookie expires (default ~1 day)
   - Invalidated by explicit sign out
   - User redirected to sign in on next protected route attempt

5. **Account Management**
   - Users can update profile (application specific)
   - Password change via email reset flow
   - Account deletion (if implemented)
   - Linked OAuth account management

## Extensibility & Customization

### Adding New Providers
1. Install provider package (e.g., `next-auth/providers/github`)
2. Add provider to `providers` array in `auth.ts`
3. Add required environment variables
4. Configure any provider-specific callbacks

### Customizing User Fields
1. Extend Prisma schema with new user fields
2. Modify `jwt` callback to include new fields in token
3. Modify `session` callback to expose fields in session
4. Update registration/login forms as needed

### Changing Session Strategy
1. Modify `session.strategy` in NextAuth config
2. Options: `"jwt"` (default) or `"database"`
3. Database strategy stores sessions in `sessions` table
4. JWT strategy preferred for scalability and CDN compatibility

### Implementing MFA/2FA
1. Add second factor verification after primary auth
2. Store temporary state in database or encrypted cookie
3. Verify second factor before completing session creation
4. Requires custom callback implementation

### Social Integration Enrichment
1. In `jwt` or `session` callbacks, fetch additional profile data
2. Store in user record or token as needed
3. Examples: profile picture, locale, timezone