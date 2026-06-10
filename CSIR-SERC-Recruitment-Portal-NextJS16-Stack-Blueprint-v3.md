# CSIR-SERC Advanced Recruitment Portal  
## Technical & Procurement-Ready Development Blueprint  

**Council of Scientific & Industrial Research (GoI)**  
**Version:** 3.0  
**Stack Focus:** Next.js 16 + Turbopack + React 19.2 + Node.js 25 + Prisma ORM + PostgreSQL 18 + Redis 7 + GovCloud  
**Compliance:** Government of India Standards  
**Document Type:** Technical & Procurement-Ready Development Blueprint  
**Status:** Ready for Nodal Officer Review, GFR 2017 TEC Alignment, and Compliance Sign-off  
**Prepared For:** CSIR-SERC Recruitment Digitization Initiative  

---

## Revision Summary

This document consolidates the complete technology stack, architecture, development plan, compliance model, database design strategy, security controls, testing approach, deployment workflow, and project structure for the **CSIR-SERC Advanced Recruitment Portal**.

The earlier Nuxt 4-oriented plan has been updated to a **Next.js 16-first architecture** with **Turbopack**, **React Server Components**, **Node.js 25**, **Prisma ORM**, and **PostgreSQL 18**.

> **Production Governance Note:** Node.js 25 is a Current / non-LTS release. It may be used for advanced runtime features, but the project governance committee may optionally approve an LTS fallback track if required by procurement, security audit, or long-term maintenance policy.

---

# 1. Executive Summary

The proposed **Advanced Recruitment Portal** for CSIR-SERC digitizes the complete recruitment lifecycle, including applicant registration, post selection, eligibility validation, DoPT-compliant rule processing, reservation logic, payment handling, document upload, OCR-assisted scrutiny, multi-stage administrative approval, audit logging, analytics, exports, and final handover.

The system is designed for:

- DoPT-compliant eligibility and age relaxation checks
- CSIR Service Rule alignment
- DPDP Act 2023 privacy workflows
- CVC-compliant transparency and immutable audit trails
- GIGW 3.0 and WCAG 2.1 AA accessibility
- CERT-In-auditable security controls
- RBI-compliant payment reconciliation
- India-resident hosting, logs, database, and backups

The architecture uses **Next.js 16 App Router**, **Turbopack**, **React Server Components**, **Server Actions**, **Node.js 25**, **Prisma ORM**, **PostgreSQL 18**, **Redis 7**, and **NIC Cloud / MeitY-empaneled GovCloud** infrastructure.

**Project Duration:** 30 Weeks  
**Deployment Target:** NIC Cloud / MeitY-Empaneled GovCloud  
**Governance:** PMO + CSIR-SERC Steering Committee + CERT-In Auditor + DPDP Data Officer  

---

# 2. Final Technical Baseline

```txt
Technical Base:
Next.js 16 + Turbopack + React 19.2 + Node.js 25 + Prisma ORM + PostgreSQL 18 + Redis 7 + GovCloud
```

## 2.1 Technology Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 App Router, React 19.2, TypeScript | SSR, Server Components, routing, accessibility-first UI |
| Build Engine | Turbopack | Faster development and production build workflow |
| UI | Tailwind CSS v4, shadcn/ui / HeroUI, MD3 design principles | Responsive, accessible, reusable interface |
| Backend | Node.js 25, Next.js Route Handlers, Server Actions | API processing, secure mutations, SSR backend logic |
| ORM | Prisma ORM | Type-safe DB access, migrations, schema management |
| Database | PostgreSQL 18.x | ACID persistence, RLS, JSONB, generated columns, search, audit |
| Cache | Redis 7+ | Sessions, OTP throttling, rate limiting, queue locks |
| Search | PostgreSQL full-text search, pg_trgm, optional pgvector | OCR search, fuzzy search, future document similarity |
| Storage | NIC Object Storage / encrypted NAS | Uploaded documents, PDFs, templates, backups |
| Auth | JWT, OIDC/OAuth2, LDAP/AD, MFA | Applicant and staff identity management |
| OCR | Tesseract.js / pdftotext local processing | Local text extraction without external SaaS |
| PDF | PDFKit / server-rendered templates | Application forms, admit cards, scrutiny reports |
| DevOps | Docker, GitHub Actions / GitLab CI / ArgoCD | CI/CD, deployment automation, compliance checks |
| Monitoring | Prometheus, Grafana, ELK/OpenSearch | Metrics, logs, alerts, audit observability |
| Hosting | NIC Cloud / MeitY-empaneled GovCloud | India data residency, WAF, DR, secure deployment |

---

# 3. Compliance & Regulatory Alignment Matrix

| Domain | GoI / Regulatory Standard | System Implementation | Validation Artifact |
|---|---|---|---|
| Reservation & Age | DoPT OMs, CSIR Service Rules | Versioned rule engine, age relaxation, crucial date validation, category rules | DoPT Rule Simulator Report |
| Data Privacy | DPDP Act 2023 | Explicit consent, purpose limitation, minimization, erasure workflow, breach response | DPDP Compliance Certificate |
| Transparency | CVC Guidelines | Immutable hash-chain audit logs, role segregation, timestamped approvals, lock-on-submit | CVC Audit Trail Format |
| Security | MeitY Security Guidelines, CERT-In | OWASP Top 10 mitigation, TLS 1.3, WAF, SAST/DAST, annual pentest | CERT-In Pentest Report |
| Accessibility | GIGW 3.0, WCAG 2.1 AA | ARIA landmarks, keyboard navigation, contrast ratio checks, bilingual interface | WCAG AA Conformance Report |
| Payments | RBI Payment Gateway Guidelines | UPI/PSB gateway, idempotency keys, webhook validation, refund handling | Payment Compliance Certificate |
| Data Localization | MeitY / DPDP | DB, logs, backups, object storage hosted within India | Data Residency Declaration |
| Auditability | CVC / Internal Audit | Append-only audit table, cryptographic chain, weekly verification | Audit Integrity Report |
| Procurement | GFR 2017 TEC | Measurable acceptance criteria, standards-based stack, documented deliverables | TEC Evaluation Matrix |

---

# 4. Architecture Overview

## 4.1 High-Level Architecture

```txt
Applicant / Admin Browser
        |
        v
Next.js 16 App Router
        |
        |-- React Server Components
        |-- Client Components for interactive forms
        |-- Server Actions for secure mutations
        |-- Route Handlers for APIs and webhooks
        |-- proxy.ts for request boundary and RBAC checks
        |
        v
Node.js 25 Runtime
        |
        |-- Auth Service
        |-- DoPT Rule Engine
        |-- Payment Service
        |-- OCR Worker
        |-- PDF Generator
        |-- Audit Logger
        |-- Export Engine
        |
        v
Prisma ORM
        |
        v
PostgreSQL 18 + Redis 7 + Object Storage
```

## 4.2 Application Rendering Strategy

| Area | Rendering Mode | Reason |
|---|---|---|
| Home page | Static / cached | High performance, public information |
| Advertisement pages | Cached Server Component | SEO, GIGW performance, repeated access |
| Eligibility instructions | Cached Server Component | Static rules with version awareness |
| Applicant dashboard | Dynamic | Personalized draft, payment, and submission status |
| Admin scrutiny | Dynamic | Role-based queues and live workflow state |
| Audit logs | Dynamic, admin-only | Sensitive, role-controlled access |
| Reports / exports | Server-side generation | Security, consistency, auditability |

---

# 5. Next.js 16 Build Plan with Turbopack

## 5.1 Next.js 16 Features to Use

- **App Router** for file-based routing and nested layouts
- **React Server Components** for secure server-side rendering
- **Server Actions** for form submissions and approval mutations
- **Route Handlers** for REST APIs, payment webhooks, OCR, and exports
- **Cache Components** with explicit `"use cache"` for public / semi-static content
- **Turbopack** for development and production builds
- **React Compiler** for automatic memoization support where applicable
- **proxy.ts** for request-boundary checks replacing older middleware-style assumptions
- **Streaming UI** using `loading.tsx`, Suspense, and server boundaries

## 5.2 `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,

  experimental: {
    turbopackFileSystemCacheForDev: true
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: []
  },

  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
```

## 5.3 Build Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "test": "vitest",
    "test:e2e": "playwright test",
    "audit:integrity": "tsx scripts/audit-integrity.ts",
    "ocr:validate": "tsx scripts/validate-ocr.ts"
  }
}
```

---

# 6. Node.js 25 Runtime Plan

## 6.1 Intended Node.js 25 Usage

Node.js 25 will be used for:

- High-performance JSON serialization workloads
- Server Actions and Route Handler execution
- OCR worker orchestration
- PDF generation
- Payment webhook verification
- Export generation
- Audit hash-chain calculation
- Secure runtime restrictions using permission flags where supported

## 6.2 Hardened Runtime Example

```bash
NODE_ENV=production \
node \
  --permission \
  --allow-net=localhost,db.internal.nic,redis.internal.nic,payment-gateway.gov.in \
  --allow-fs-read=/app,/etc/ssl/certs \
  --allow-fs-write=/app/.next/cache,/app/logs,/tmp \
  --compile-cache \
  server.js
```

## 6.3 Governance Note for TEC

Because Node.js 25 is a Current release, the project should include one of the following procurement statements:

```txt
Option A: Node.js 25 shall be used subject to security audit and nodal approval.
Option B: Node.js 25 shall be used in development / staging, with production deployment on latest approved LTS if mandated by the security auditor.
Option C: Runtime version shall be finalized during Phase 2 architecture review based on NIC/GovCloud support matrix.
```

---

# 7. PostgreSQL 18 + Prisma ORM Database Plan

## 7.1 PostgreSQL 18 Capabilities to Use

- Row-Level Security for applicant/admin data segregation
- JSONB for dynamic recruitment forms and post-wise custom fields
- Generated columns for derived searchable fields
- Full-text search for OCR content
- `pg_trgm` for fuzzy name, certificate, and institution search
- `uuidv7()` strategy for time-ordered unique identifiers where supported by SQL migration
- Advanced indexing for post-wise filtering and scrutiny queues
- Append-only audit logs with hash-chain integrity
- Read replicas for peak traffic and reporting workloads
- PITR and encrypted backups

## 7.2 Prisma Responsibilities

Prisma ORM will manage:

- Core schema models
- Type-safe CRUD access
- Relations
- Transactions
- Migration baseline
- Application-level validation support
- Seed data for roles, posts, rules, and test workflows

Advanced PostgreSQL capabilities such as RLS policies, extensions, generated columns, triggers, and custom indexes shall be implemented through Prisma SQL migrations.

---

# 8. Prisma Schema Direction

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  APPLICANT
  SCRUTINY_OFFICER
  REVIEWER
  DIRECTOR_APPROVER
  ADMIN
  AUDITOR
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  PAYMENT_PENDING
  PAYMENT_SUCCESS
  UNDER_SCRUTINY
  RETURNED_FOR_CLARIFICATION
  RECOMMENDED
  REJECTED
  DIRECTOR_APPROVED
  LOCKED
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  mobile         String?  @unique
  name           String
  role           UserRole @default(APPLICANT)
  passwordHash   String?
  ldapSubject    String?
  oidcSubject    String?
  mfaEnabled     Boolean  @default(false)
  consentVersion String?
  consentAt      DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  applications   Application[]
  auditLogs      AuditLog[]

  @@index([role])
  @@index([email])
}

model RecruitmentPost {
  id              String   @id @default(uuid())
  postCode        String   @unique
  title           String
  advertisementNo String
  crucialDate     DateTime
  categoryMatrix  Json
  eligibilityRule Json
  feeRule         Json
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  applications    Application[]

  @@index([advertisementNo])
  @@index([isActive, crucialDate])
}

model Application {
  id                String            @id @default(uuid())
  applicationNo     String            @unique
  applicantId       String
  postId            String
  status            ApplicationStatus @default(DRAFT)
  category          String
  dob               DateTime
  formData          Json
  eligibilityResult Json?
  paymentStatus     String?
  submittedAt       DateTime?
  lockedAt          DateTime?
  finalHash         String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  applicant         User              @relation(fields: [applicantId], references: [id])
  post              RecruitmentPost   @relation(fields: [postId], references: [id])
  documents         Document[]
  scrutinyActions   ScrutinyAction[]
  payments          Payment[]

  @@index([postId, status])
  @@index([applicantId])
  @@index([category, status])
  @@index([submittedAt])
}

model Document {
  id               String   @id @default(uuid())
  applicationId    String
  documentType     String
  storageKey       String
  mimeType         String
  fileHash         String
  ocrText          String?
  ocrConfidence    Float?
  verificationFlag Boolean  @default(false)
  uploadedAt       DateTime @default(now())

  application      Application @relation(fields: [applicationId], references: [id])

  @@index([applicationId])
  @@index([documentType])
  @@index([ocrConfidence])
}

model Payment {
  id              String   @id @default(uuid())
  applicationId   String
  gatewayRef       String   @unique
  amount           Decimal
  status           String
  idempotencyKey   String   @unique
  webhookPayload   Json?
  paidAt           DateTime?
  createdAt        DateTime @default(now())

  application      Application @relation(fields: [applicationId], references: [id])

  @@index([applicationId, status])
}

model ScrutinyAction {
  id              String   @id @default(uuid())
  applicationId   String
  actorId         String
  fromStatus      String
  toStatus        String
  remarks         String?
  actionPayload   Json?
  createdAt       DateTime @default(now())

  application     Application @relation(fields: [applicationId], references: [id])

  @@index([applicationId])
  @@index([actorId])
  @@index([createdAt])
}

model AuditLog {
  id              String   @id @default(uuid())
  actorId         String?
  action          String
  entityType      String
  entityId        String
  ipAddress       String?
  userAgent       String?
  beforeJson      Json?
  afterJson       Json?
  previousHash    String?
  currentHash     String
  createdAt       DateTime @default(now())

  actor           User?    @relation(fields: [actorId], references: [id])

  @@index([entityType, entityId])
  @@index([actorId])
  @@index([createdAt])
}
```

---

# 9. PostgreSQL Native SQL Migration Layer

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
-- CREATE EXTENSION IF NOT EXISTS vector; -- enable only after approval for AI/document similarity features

ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_document_ocr_fts
ON "Document"
USING gin (to_tsvector('english', coalesce("ocrText", '')));

CREATE INDEX IF NOT EXISTS idx_user_name_trgm
ON "User"
USING gin ("name" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_application_formdata_gin
ON "Application"
USING gin ("formData");

CREATE INDEX IF NOT EXISTS idx_application_scrutiny_queue
ON "Application" ("postId", "status", "category", "submittedAt");
```

## 9.1 RLS Direction

```sql
CREATE POLICY applicant_own_application_policy
ON "Application"
FOR SELECT
USING ("applicantId" = current_setting('app.current_user_id', true));

CREATE POLICY scrutiny_officer_read_policy
ON "Application"
FOR SELECT
USING (current_setting('app.current_role', true) IN ('SCRUTINY_OFFICER', 'REVIEWER', 'DIRECTOR_APPROVER', 'ADMIN', 'AUDITOR'));
```

---

# 10. Functional Modules

## 10.1 Applicant Portal — 7-Step Workflow

| Step | Module | Implementation |
|---|---|---|
| 1 | Registration | Server Action, Zod validation, OTP/email verification, consent capture |
| 2 | Post Selection | Server Component fetches active posts from Prisma |
| 3 | Eligibility | Server-side DoPT rule engine, category/age/crucial-date validation |
| 4 | Form Entry | Client wizard, draft autosave API, schema-driven dynamic fields |
| 5 | Fee Payment | UPI/PSB gateway, idempotency key, webhook reconciliation |
| 6 | Submission | Server Action locks application, creates final hash, disables edits |
| 7 | PDF Generation | Server-generated PDF, signed expiring link, unique application number |

## 10.2 Administrative Scrutiny Panel

Features:

- Post-wise application queue
- Category-wise filters
- Eligibility flags
- OCR confidence flags
- Bulk shortlisting / rejection workflow
- Multi-stage approval chain
- Director approval module
- Remarks and deficiency communication
- Immutable audit logging
- Export to CSV/Excel/PDF

Roles:

- Applicant
- Scrutiny Officer
- Reviewer
- Director Approver
- Admin
- Auditor

## 10.3 DoPT Rule Engine

The rule engine shall support:

- Crucial date validation
- Age limits
- Age relaxation by category
- Upper age cap rules
- OBC/EWS certificate date validation
- PwBD relaxation
- Ex-servicemen logic if applicable
- Post-specific eligibility rules
- Rule versioning
- Simulator for audit testing

## 10.4 OCR & Search

Flow:

```txt
Document Upload
→ Virus Scan
→ Encrypted Object Storage
→ OCR Queue
→ Tesseract.js / pdftotext
→ Extracted Text + Confidence Score
→ PostgreSQL Full-Text Index
→ Manual Verification if Confidence < Threshold
```

Search capabilities:

- OCR text search
- Candidate name fuzzy search
- Institution name search
- Certificate number search
- Experience keyword search
- DOB/category/application status filters

## 10.5 Payments

Payment module requirements:

- UPI intent / PSB gateway support
- Idempotency key per transaction
- Webhook HMAC validation
- Retry and reconciliation workflow
- Refund status capture
- Payment failure-safe draft retention
- Audit trail for all payment state changes

## 10.6 Analytics & Exports

Analytics dashboards:

- Category-wise application count
- Post-wise submissions
- Payment status funnel
- Scrutiny stage funnel
- OCR confidence distribution
- Gender/category/PwBD statistics where applicable
- Pending approval aging report

Exports:

- CSV
- Excel
- PDF
- Audit log export
- TEC / STQC / recruitment committee formats
- Signed and expiring download links

---

# 11. Security, Privacy & Data Governance

| Requirement | Implementation |
|---|---|
| DPDP Consent | Explicit purpose-based consent modal, consent version storage |
| Data Minimization | Collect only recruitment-relevant data |
| Erasure Workflow | Data Principal request handler subject to records policy |
| Audit Trail | Append-only hash-chained audit table |
| Encryption at Rest | DB volume encryption, object storage encryption, encrypted backups |
| Encryption in Transit | TLS 1.3, HSTS, secure cookies |
| RBAC | Role-based guards, RLS, route-level authorization |
| MFA | Mandatory for admin and scrutiny users |
| Session Security | Refresh rotation, idle timeout, secure cookie flags |
| API Security | Rate limits, CSRF mitigation, request validation |
| File Security | MIME validation, extension checks, file hash, virus scan |
| Data Localization | All production data, backups, logs within India |
| Monitoring | Security logs, anomaly alerts, failed login alerts |

---

# 12. `proxy.ts` Security Boundary

```ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/applicant/:path*", "/api/:path*"]
};
```

---

# 13. Updated Project Structure

```txt
csir-recruitment-portal/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── favicons/
│   ├── pdf-templates/
│   └── robots.txt
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── logout/page.tsx
│   ├── applicant/
│   │   ├── layout.tsx
│   │   ├── step1-register/page.tsx
│   │   ├── step2-post-select/page.tsx
│   │   ├── step3-eligibility/page.tsx
│   │   ├── step4-form/page.tsx
│   │   ├── step5-payment/page.tsx
│   │   ├── step6-submit/page.tsx
│   │   └── step7-pdflink/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── scrutiny/page.tsx
│   │   ├── approval/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── exports/page.tsx
│   ├── jobs/
│   │   └── [jobId]/application/page.tsx
│   └── api/
│       ├── auth/
│       ├── application/
│       ├── payment/
│       ├── ocr/
│       ├── compliance/
│       ├── audit/
│       └── export/
├── components/
│   ├── ui/
│   ├── recruitment/
│   ├── admin/
│   └── common/
├── hooks/
│   ├── useAuth.ts
│   ├── useDoPTRules.ts
│   ├── usePayment.ts
│   ├── useOCR.ts
│   ├── useAudit.ts
│   └── useExport.ts
├── lib/
│   ├── auth/
│   ├── db/
│   │   ├── prisma.ts
│   │   ├── rls.ts
│   │   └── transaction.ts
│   ├── compliance/
│   │   ├── dopt-rules.ts
│   │   ├── age-calculator.ts
│   │   └── reservation-engine.ts
│   ├── crypto/
│   │   ├── hash-chain.ts
│   │   ├── aes.ts
│   │   └── hmac.ts
│   ├── pdf/
│   ├── ocr/
│   ├── payment/
│   ├── export/
│   └── validators/
├── proxy.ts
├── config/
│   ├── gigw.ts
│   ├── accessibility.ts
│   ├── compliance.ts
│   └── security.ts
├── scripts/
│   ├── migrate-rules.ts
│   ├── validate-ocr.ts
│   ├── audit-integrity.ts
│   └── db-health.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── compliance/
├── docker-compose.yml
├── README.md
└── GOVERNANCE.md
```

---

# 14. Package Baseline

```json
{
  "engines": {
    "node": ">=25.0.0",
    "npm": ">=11.0.0"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@prisma/client": "latest",
    "pg": "latest",
    "@prisma/adapter-pg": "latest",
    "zod": "latest",
    "bcryptjs": "latest",
    "jose": "latest",
    "redis": "latest",
    "pdfkit": "latest",
    "tesseract.js": "latest",
    "sharp": "latest",
    "xlsx": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "prisma": "latest",
    "eslint": "latest",
    "vitest": "latest",
    "playwright": "latest",
    "tsx": "latest",
    "@types/node": "latest"
  }
}
```

---

# 15. Development Phases & Milestones — 30 Weeks

| Phase | Duration | Key Deliverables | Compliance Gate |
|---|---:|---|---|
| 1. Inception & Compliance Mapping | Week 1–3 | RSD, compliance matrix, rule versioning spec, GFR alignment | CSIR-SERC approval, compliance sign-off |
| 2. Architecture & Design | Week 4–6 | SDD, App Router design, Prisma ERD, DB schema, API contracts, UX wireframes | MeitY security review, GIGW design audit |
| 3. Core Development | Week 7–16 | Applicant portal, admin panel, DoPT engine, auth, payment workflow | Internal code review, mock compliance test |
| 4. Advanced Features & Integration | Week 17–20 | OCR pipeline, analytics, exports, audit hash chain, notifications | Integration sign-off, OCR accuracy report |
| 5. Testing & Validation | Week 21–24 | Unit, integration, E2E, load, accessibility, security tests | QA Gate, CERT-In pentest, WCAG audit |
| 6. UAT & Deployment | Week 25–28 | UAT, staging, blue-green deployment, DR drill, rollback plan | UAT sign-off, go-live authorization |
| 7. Training & Handover | Week 29–30 | Admin manual, applicant guide, API docs, SLA, KT sessions | KT certificate, PMO closure |

---

# 16. Testing & QA Strategy

| Test Type | Tool / Method | Acceptance Standard |
|---|---|---|
| Unit Testing | Vitest | Core functions and rule engine covered |
| E2E Testing | Playwright | Applicant and admin workflows automated |
| API Testing | Supertest / Playwright API | Auth, payments, OCR, exports validated |
| Compliance Testing | Custom DoPT simulator | 100% rule scenarios validated |
| Accessibility | axe-core, WAVE, NVDA | WCAG 2.1 AA compliance |
| Security | OWASP ZAP, SAST, DAST | Zero critical/high vulnerabilities |
| Performance | k6 / JMeter | Peak crucial-date load validated |
| DB Testing | Migration dry run, explain analyze | Index and query performance accepted |
| OCR Testing | Dummy certificate suite | Accuracy threshold and manual fallback validated |
| UAT | CSIR-SERC panel | Workflow, exports, audit logs signed off |

---

# 17. DevOps & Go-Live Protocol

## 17.1 CI/CD Flow

```txt
Code Commit
→ ESLint
→ TypeScript Check
→ Unit Tests
→ Prisma Schema Validation
→ Prisma Migration Dry Run
→ Next.js 16 Turbopack Build
→ SAST / Dependency Scan
→ Playwright E2E
→ OWASP ZAP Baseline
→ Docker Image Build
→ Image Signing
→ Staging Deployment
→ DB Migration Deploy
→ Accessibility Audit
→ Security Review
→ Blue-Green Production Deployment
```

## 17.2 Go-Live Checklist

- CERT-In Penetration Test Report
- WCAG 2.1 AA / GIGW Compliance Certificate
- DPDP Consent and Data Processing Matrix
- Payment Gateway UAT Sign-off
- Load Test Report
- Backup and Restore Drill Report
- DR Plan
- Admin SOPs
- Applicant User Guide
- Nodal Officer Approval
- Steering Committee Sign-off

## 17.3 Post-Go-Live Support

| Severity | Response Time | Example |
|---|---:|---|
| P1 | 15 minutes | Portal down, payment failure, data breach suspicion |
| P2 | 1 hour | Admin workflow blocked, OCR queue failure |
| P3 | 4 hours | Export issue, UI defect, minor accessibility issue |
| P4 | Next business day | Enhancement or documentation correction |

Hypercare duration: **14 days after go-live**  
Support duration: **12 months minimum**  

---

# 18. Risk Management

| Risk | Impact | Mitigation |
|---|---|---|
| DoPT rule changes post-launch | Compliance breach | Versioned rule engine and admin-configurable criteria |
| OCR inaccuracy | Incorrect scrutiny flag | Confidence threshold and manual verification |
| Payment downtime | Applicant submission failure | Retry, fallback gateway, reconciliation queue |
| Peak traffic | System slowdown | CDN, caching, autoscaling, DB read replicas |
| Audit tampering | CVC non-compliance | Hash-chain audit table and weekly verification |
| Node.js 25 non-LTS concern | Procurement / support objection | TEC note and LTS fallback option |
| Data breach | Legal and reputational impact | Encryption, RBAC, monitoring, incident SOP |
| Staff adoption resistance | Low utilization | Role-based training and helpdesk support |
| Migration failure | Deployment rollback | Staging migration rehearsal and rollback plan |

---

# 19. Governance & Resource Allocation

| Role | Responsibility | GoI Alignment |
|---|---|---|
| Project Manager | Timeline, communication, delivery governance | GFR 2017 reporting |
| Compliance Officer | DoPT, DPDP, CVC, GIGW mapping | Regulatory coordination |
| Solution Architect | Stack, security, scalability | MeitY / GovCloud alignment |
| Backend Developer | APIs, Prisma, PostgreSQL, payments | Secure code and data integrity |
| Frontend Developer | Next.js UI, accessibility, forms | GIGW / WCAG compliance |
| QA Lead | Testing, E2E, compliance simulation | Acceptance validation |
| Security Lead | SAST, DAST, pentest coordination | CERT-In readiness |
| DevOps Engineer | CI/CD, deployment, monitoring | GovCloud operations |
| Technical Writer | SOPs, manuals, API docs | GIGW content standards |
| CSIR-SERC Nodal Team | UAT and operational approval | Institutional sign-off |

---

# 20. Deliverables & Acceptance Criteria

| Deliverable | Acceptance Standard |
|---|---|
| Source Code | Clean, typed, linted, documented, dependency scanned |
| Next.js Application | App Router, Turbopack build, SSR/dynamic routing working |
| Prisma Schema | Valid migrations, typed models, seed data |
| PostgreSQL DB | RLS, indexes, JSONB, full-text search, backup tested |
| API Documentation | OpenAPI 3.0, auth flows, error codes, rate limits |
| Admin Manual | Role-wise scrutiny and approval SOP |
| Applicant Guide | Accessible, bilingual-ready, PDF/print friendly |
| Compliance Reports | DoPT simulator, DPDP matrix, WCAG audit, pentest report |
| Audit Export | Hash-chain verifiable, timestamped, role-filtered |
| Training | Minimum 3 sessions and recorded demos |
| Deployment | Blue-green release, rollback, monitoring, DR tested |

---

# 21. Maintenance & Future Roadmap

## 21.1 Maintenance Cycle

- Monthly dependency scan
- Quarterly accessibility review
- Quarterly DB performance review
- Annual CERT-In pentest
- Annual DPDP compliance audit
- Annual DoPT rule refresh
- Backup restore drill every six months
- Audit integrity check weekly

## 21.2 Roadmap

| Feature | Target |
|---|---|
| Rule Versioning UI | Phase 2 enhancement |
| Interview Scheduling | Future recruitment cycle |
| AI-assisted document verification | Subject to approval and privacy review |
| pgvector-based similarity search | Optional future module |
| Payroll / HRMS integration | Future administrative integration |
| DigiLocker integration | Subject to GoI API approval |
| SMS / WhatsApp integration | Based on empaneled vendor and consent |

---

# 22. Immediate Next Steps for CSIR-SERC

1. Approve this updated Next.js 16-based development blueprint.
2. Nominate Nodal Officer and Compliance Officer.
3. Confirm Node.js 25 production acceptability or approve LTS fallback clause.
4. Initiate GFR 2017 procurement and TEC alignment.
5. Conduct compliance kickoff with HR, Legal, IT, and DoPT liaison.
6. Provision NIC Cloud / GovCloud staging environment.
7. Begin Phase 1: Inception and Compliance Mapping.

---

# 23. Procurement-Ready Summary Wording

```txt
The proposed system shall be developed using Next.js 16 with Turbopack, React Server Components, Node.js 25 runtime, Prisma ORM, PostgreSQL 18, Redis 7, and NIC Cloud / MeitY-empaneled GovCloud infrastructure. The solution shall implement server-side rendering, secure API route handlers, server actions, role-based access control, PostgreSQL Row-Level Security, JSONB-based dynamic forms, full-text OCR search, cryptographic audit trails, DPDP-compliant consent management, GIGW/WCAG-compliant responsive interfaces, payment reconciliation, and CVC-compliant administrative approval workflows. All production data, logs, backups, and uploaded documents shall remain within India.
```

---

# 24. Final Technical Base

```txt
CSIR-SERC Advanced Recruitment Portal
Version: 3.0
Frontend: Next.js 16 + React 19.2 + Tailwind CSS v4
Build: Turbopack
Backend: Node.js 25 + Next.js Route Handlers + Server Actions
ORM: Prisma ORM
Database: PostgreSQL 18
Cache: Redis 7
Storage: NIC Object Storage / Encrypted NAS
OCR: Tesseract.js / pdftotext local processing
PDF: PDFKit / server-rendered templates
Security: RBAC + RLS + MFA + CSP + HSTS + audit hash chain
Deployment: NIC Cloud / MeitY-Empaneled GovCloud
Compliance: DoPT + DPDP Act 2023 + GIGW 3.0 + WCAG 2.1 AA + CVC + MeitY + CERT-In + RBI payment norms
Status: Procurement-Ready / Nodal Officer Review
```

---

**End of Document**
