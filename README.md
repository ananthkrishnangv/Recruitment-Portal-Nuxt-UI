# CSIR-SERC Recruitment Portal — Production Foundation v0.2

This is the second development iteration of the CSIR-SERC Recruitment Portal.

It is a **workable full-stack Next.js 16 application foundation** with:

- Next.js 16 App Router + Turbopack scripts
- React Server Components and Server Actions
- Prisma ORM + PostgreSQL 18-ready schema
- Phone / local Aadhaar identifier login model
- No real Aadhaar / UIDAI integration
- Applicant self-service dashboard
- Reusable applicant document vault
- Server-side file upload to local storage folder
- Prisma-backed application list
- Airtable-style admin grid with colour tags and CSV export
- Scrutiny quick-view page
- Settings persistence for site, SMTP, Telegram, optional WhatsApp and security settings
- Audit hash-chain logging service
- PostgreSQL extension and RLS migration placeholders
- CERT-In incident console, reporting register and security control checklist
- DPDP consent notice and consent history
- Separate SMTP and optional WhatsApp settings pages
- DoPT/CSIR category-wise vacancy matrix for one post with SC/ST/OBC/EWS/PwBD counts
- Docker Compose for PostgreSQL and Redis
- Deployment-oriented Dockerfile and production notes

## Quick Start

```bash
npm install
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Demo Access

Applicant:

```txt
/auth/login
Phone or local Aadhaar ID: 9876543210
OTP: 123456
```

Admin:

```txt
/admin/login
PIN: 123456
```

## Important Production Tasks Before Go-Live

This codebase is a production foundation, not a certified final deployment. Before real CSIR-SERC production go-live:

1. Replace demo OTP with approved SMS/Email OTP provider.
2. Replace demo admin PIN with LDAP/OIDC/MFA.
3. Move uploaded files to NIC Object Storage / encrypted NAS.
4. Conduct CERT-In security audit and penetration testing.
5. Validate DPDP consent text and retention policy with competent authority.
6. Validate DoPT/CSIR recruitment rule engine with HR/legal team.
7. Enable strict PostgreSQL RLS with application-level `SET LOCAL app.current_user_id`.
8. Configure production SMTP/Telegram/optional WhatsApp via secure secret store.
9. Use TLS, WAF, DDoS controls, backups and DR as per GovCloud policy.

## Aadhaar Scope

Aadhaar is treated only as a locally captured applicant identifier for deduplication/profile reference. This application does **not** integrate with UIDAI, e-KYC, biometric verification, or Aadhaar authentication servers.


## New v0.3 Compliance Routes

```txt
/admin/cert-in
CERT-In incident register, security control checklist, reporting reference capture

/admin/settings/smtp
Dedicated SMTP settings page

/admin/settings/whatsapp
Dedicated optional WhatsApp provider/template settings page

/admin/recruitment-rules
DoPT/CSIR rules and category-wise vacancy matrix

/applicant/consent
DPDP consent notice and consent history
```
