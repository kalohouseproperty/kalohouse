# Kalohouse Property Marketplace

Premium dark Next.js frontend for a trust-first real estate marketplace in Kigali.

## Frontend

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For deployment, set:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api/v1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

If `NEXT_PUBLIC_API_URL` is missing on Vercel, media URLs will resolve against the Vercel domain instead of the backend, so backend-served property images will not load.

## Product Overview

## 📌 Overview
Kalohouse is a **trust-first real estate marketplace** designed for Kigali, Rwanda.

Unlike traditional platforms, Kalohouse ensures:
- ✅ Only **verified properties** are published  
- 👷 **Agents physically inspect** every listing  
- 💳 **Payments are secured** through the platform  
- 🔁 **Refunds are controlled** with commission deduction  

> **Core Idea:** Build trust in real estate through verification and secure transactions.

---

## 🎯 Objectives
- Eliminate fake property listings  
- Ensure all listings are physically verified  
- Enable secure transactions between clients and property owners  
- Build a premium, modern real estate experience  
- Organize property management by Kigali sectors  

---

## 👥 User Roles

### 🛡️ Admin (Boss)
- Full system control  
- Manage agents  
- Generate agent signup links  
- Assign sectors  
- Manage commission rates  
- Monitor all users and properties  
- Track payments, refunds, and payouts  

### 👷 Agent (Sector-Based)
- Assigned to one Kigali sector  
- Receives property submissions in their sector  
- Visits and verifies properties physically  
- Uploads:
  - 4 images  
  - 1 video  
  - verification notes  
- Approves or rejects properties  

> **Main responsibility: TRUST**

### 🏘️ Landlord / Seller
- Submit property (Rent or Sale)  
- Provide property details  
- Track verification status  
- Track listing status  
- Track payout  

### 🧑‍💼 Tenant / Buyer
- Browse verified properties  
- Filter by sector, price, type  
- Pay before visiting  
- Request property visits  
- Get refund if they change their mind  

---

## 🔁 System Workflow

### Property Flow

Owner submits property
↓
Status: Pending Verification
↓
System assigns agent (same sector)
↓
Agent visits property physically
↓
Agent uploads:

4 images
1 video
notes
↓
Agent approves/rejects
↓
If approved → Published
↓
Client pays
↓
Client visits
↓
Accept → proceed
Reject → refund (minus commission)

---

## 💳 Payment & Refund Logic

### Payment Flow

Client selects property
↓
System calculates:
owner_price + commission
↓
Client pays total
↓
Money stored in Kalohouse account


### Refund Flow

Client cancels after visit
↓
Refund = total_paid - commission_fee
↓
Admin approves refund
↓
Owner not paid


### Payout Flow

Client accepts property
↓
System transfers:
owner_price → owner
commission → platform


---

## 🧠 Core Features

### 🔐 Authentication
- Role-based access control  
- Agent signup via invitation links  

### 🏘️ Property Management
- Rent / Sale selection  
- Sector-based assignment  
- Status tracking  
- Required media:
  - 4 images  
  - 1 video  

### 🧾 Verification System
- Agent-based verification  
- Notes + media proof  
- Approve/reject system  

### 💰 Payment System
- Pre-visit payment  
- Commission calculation  
- Refund handling  

### 📊 Dashboards
- Admin: manage system, users, transactions  
- Agent: verify properties, upload media  
- Owner: submit & track properties  
- Client: browse, pay, track visits  

---

## 🗃️ Database Design

### users

id
name
email
role (admin, agent, owner, client)
sector_id


### sectors

id
name
district


### properties

id
title
type (rent/sale)
price
sector_id
owner_id
status
description
created_at


### property_media

id
property_id
type (image/video)
url


### verifications

id
property_id
agent_id
notes
status
verified_at


### payments

id
property_id
client_id
amount
commission
status


### refunds

id
payment_id
amount
status


### payouts

id
property_id
owner_id
amount
status


### agent_invites

id
email
sector_id
token
status


---

## 🎨 UI/UX System

### Design Principles
- Premium real estate feel  
- Dark modern interface  
- Gold accent highlights  
- Clean and minimal layout  
- Smooth transitions  

### Key UI Elements
- Verified badge  
- Property cards with media preview  
- Sector filter  
- Status indicators  
- Payment protection label  

---

## 📱 Pages Structure

/
Landing page

/properties
Listings page

/properties/[id]
Property details

/auth
Login/Register

/dashboard/admin
Admin dashboard

/dashboard/agent
Agent dashboard

/dashboard/owner
Owner dashboard

/dashboard/client
Client dashboard


---

## 🔐 Security Considerations
- Only verified properties are published  
- Role-based route protection  
- Secure payment validation  
- Agent-controlled verification system  
- Media validation  

---

## ⚙️ Tech Stack

Frontend: Next.js + Tailwind CSS + shadcn/ui
Backend: Next.js API Routes / FastAPI
Database: PostgreSQL
Authentication: NextAuth.js with Prisma Adapter
Storage: Local / Direct Cloud Provider Storage
Payments: Flutterwave / Paypack (future)


---

## 🚀 MVP Scope

Authentication system
Property submission
Agent verification flow
Property listing
Basic dashboards
Simple payment simulation


---

## 🔥 Unique Value
Most platforms:
❌ Allow unverified listings  
❌ No trust system  
❌ No payment protection  

Kalohouse:
✅ Verified properties only  
✅ Sector-based agent system  
✅ Secure payments  
✅ Controlled refunds  

---

## 🧨 Final Note
Kalohouse is not just a listing platform.

It is a **trust-driven real estate system** designed to eliminate fraud and improve confidence in property transactions.

---

*Practice edit — merge this branch to test your PR workflow.*
