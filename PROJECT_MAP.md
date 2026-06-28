# Kalohouse Property Marketplace - Project Map

## Directory Structure

```
nyumbani/
├── app/                    # Next.js app router directory
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication APIs (NextAuth)
│   │   │   └── [...nextauth]/ # NextAuth dynamic route
│   │   └── db-test/        # Database testing endpoint
│   ├── auth/               # Authentication pages
│   │   ├── admin/          # Admin auth routes
│   │   ├── agent/          # Agent auth routes
│   │   ├── callback/       # Auth callback handlers
│   │   ├── reset/          # Password reset routes
│   │   ├── verify/         # Email verification routes
│   │   ├── auth.css        # Auth-specific styles
│   │   └── page.tsx        # Main auth page
│   ├── dashboard/          # Role-based dashboards
│   │   ├── admin/          # Admin dashboard
│   │   ├── agent/          # Agent dashboard
│   │   ├── client/         # Client dashboard
│   │   ├── owner/          # Owner dashboard
│   │   ├── profile/        # User profile management
│   │   └── page.tsx        # Dashboard index
│   ├── about/              # About page
│   ├── map/                # Property map functionality
│   ├── payments/           # Payment processing
│   ├── properties/         # Property browsing and details
│   ├── v2/                 # Version 2 features (if any)
│   ├── globals.css         # Global stylesheet
│   ├── icon.png            # Application icon
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable React components
│   ├── cards/              # Property cards, stat cards, etc.
│   ├── dashboard/          # Dashboard-specific components
│   ├── forms/              # Form components
│   ├── home/               # Homepage components
│   ├── layout/             # Layout components (headers, footers, etc.)
│   ├── map/                # Map-related components
│   ├── providers/          # Context providers
│   └── ui/                 # UI primitives (shadcn/ui)
├── data/                   # Static data files
│   ├── seed.ts             # Database seed script
│   └── sectors.ts          # Kigali sector data
├── lib/                    # Utility libraries
│   ├── prisma.ts           # Prisma client setup
│   ├── auth-utils.ts       # Authentication utilities
│   ├── auth-tokens.ts      # Token handling utilities
│   └── translations.ts     # Internationalization utilities
├── prisma/                 # Prisma ORM configuration
│   ├── schema.prisma       # Database schema definition
│   └── seed.ts             # Database seeding script
├── types/                  # TypeScript type definitions
│   ├── models.ts           # Database model types
│   └── property.ts         # Property-specific types
├── public/                 # Static assets
├── .agents/                # Agent configuration (possibly for AI)
├── .codex/                 # Codex configuration
├── auth.ts                 # NextAuth configuration
├── next.config.ts          # Next.js configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── proxy.ts                # API proxy/middleware configuration
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lockfile
├── README.md               # Project documentation
└── .env                    # Environment variables (not in repo, shown in README)
```

## Key Configuration Files

- **auth.ts**: NextAuth authentication provider configuration
- **next.config.ts**: Next.js custom configuration
- **proxy.ts**: API route protection middleware
- **prisma.schema.prisma**: Database schema definition
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Node.js project metadata and dependencies

## Technology Stack Identified

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google and Credentials providers
- **State Management**: React Context API (inferred from providers directory)
- **Deployment Target**: Vercel (mentioned in README)