

---

# 25. UI/UX Design System Addendum — v3.1

## 25.1 Updated UI Direction

The recruitment portal shall include a refreshed, modern, accessible, and Government-of-India-appropriate interface using either:

- **Hero UI** as the primary advanced UI component framework; or
- **Fluent UI** where Microsoft-style enterprise controls, accessibility, and data-dense administration screens are preferred.

The recommended implementation is:

```txt
Primary UI Stack:
Hero UI + Tailwind CSS v4 + shadcn-compatible design tokens

Optional Enterprise/Admin Stack:
Fluent UI components for admin tables, command bars, dialogs, and forms
```

The interface shall use **glassmorphism**, transparent panels, layered gradients, soft shadows, accessible colour contrast, responsive spacing, and a modern data-application layout while maintaining the seriousness and trust expected from a CSIR / Government recruitment portal.

---

## 25.2 Typography Standard

The portal shall use the following typography system across applicant and admin modules:

```txt
Body Font: Noto Sans
Heading Font: Montserrat
Fallback: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
```

### CSS Font Configuration

```css
:root {
  --font-body: "Noto Sans", system-ui, sans-serif;
  --font-heading: "Montserrat", "Noto Sans", system-ui, sans-serif;
}

body {
  font-family: var(--font-body);
}

h1,
h2,
h3,
h4,
h5,
h6,
.heading-font {
  font-family: var(--font-heading);
  letter-spacing: -0.02em;
}
```

### Next.js Font Setup

```tsx
import type { Metadata } from "next";
import { Noto_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-noto-sans",
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

export const metadata: Metadata = {
  title: "CSIR-SERC Recruitment Portal",
  description: "Advanced Recruitment Portal for CSIR-SERC"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

---

## 25.3 Colour System — Blue + Green Advanced Interface

The portal shall follow a blue-green mixed interface suitable for a scientific institution and public recruitment workflow.

### Design Tokens

```css
:root {
  --csir-blue-950: #06224a;
  --csir-blue-900: #073b7a;
  --csir-blue-700: #0b63ce;
  --csir-blue-500: #2f80ed;
  --csir-cyan-400: #22d3ee;

  --serc-green-900: #064e3b;
  --serc-green-700: #047857;
  --serc-green-500: #10b981;
  --serc-green-300: #6ee7b7;

  --surface-glass: rgba(255, 255, 255, 0.72);
  --surface-glass-strong: rgba(255, 255, 255, 0.86);
  --border-glass: rgba(255, 255, 255, 0.42);
  --shadow-soft: 0 18px 45px rgba(6, 34, 74, 0.14);

  --gradient-primary: linear-gradient(135deg, #073b7a 0%, #0b63ce 45%, #10b981 100%);
  --gradient-soft: radial-gradient(circle at top left, rgba(34, 211, 238, 0.28), transparent 34%),
                   radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.24), transparent 36%);
}
```

### Glass Card Utility

```css
.glass-card {
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 1.5rem;
}

.gradient-shell {
  background: var(--gradient-soft), linear-gradient(180deg, #f8fbff 0%, #eefdf8 100%);
}
```

Accessibility requirement: all text on gradient or glass backgrounds shall meet WCAG contrast targets. Decorative transparency shall not reduce readability of application instructions, eligibility rules, forms, or official notices.

---

# 26. Index Page / Landing Page Design

## 26.1 Required Landing Page Sections

The `app/page.tsx` index page shall include:

1. **Government / CSIR-SERC identity header**
   - CSIR title
   - CSIR-SERC name
   - GoI-style official visual hierarchy
   - Accessibility links: Skip to content, Screen Reader Access, Font Size, Contrast Toggle

2. **Glassmorphism hero section**
   - Blue-green gradient background
   - Transparent glass recruitment notice panel
   - Active recruitment cards
   - Important dates
   - Quick apply CTA
   - Login / Registration CTA

3. **Recruitment rules summary**
   - DoPT age relaxation note
   - CSIR recruitment rule note
   - Reservation policy note
   - Crucial date explanation

4. **Applicant self-service highlights**
   - Preloaded document vault
   - Draft autosave
   - Payment tracking
   - Application status tracking
   - Deficiency response from applicant dashboard

5. **Important links**
   - Advertisement PDF
   - Instructions
   - Eligibility criteria
   - Fee rules
   - Contact / helpdesk
   - Accessibility statement

6. **Responsive footer**
   - CSIR-SERC address
   - Helpdesk contact
   - Data privacy notice
   - Copyright
   - Last updated date

## 26.2 Suggested `app/page.tsx` Hero Skeleton

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen gradient-shell text-slate-900">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-8 lg:py-14">
        <div className="glass-card p-6 md:p-10">
          <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
            CSIR-SERC Recruitment Portal
          </p>

          <h1 className="heading-font text-4xl font-bold tracking-tight text-blue-950 md:text-6xl">
            Advanced Recruitment Portal for Transparent and Rule-Based Selection
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
            Apply online, manage documents, track payment, respond to scrutiny queries, and download submitted applications through a secure applicant self-service dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-blue-700 hover:bg-blue-800">
              <Link href="/applicant/step1-register">Apply Online</Link>
            </Button>
            <Button asChild variant="outline" className="border-emerald-600 text-emerald-800">
              <Link href="/auth/login">Login / Track Application</Link>
            </Button>
          </div>
        </div>

        <aside className="glass-card p-5 md:p-6">
          <h2 className="heading-font text-xl font-bold text-blue-950">Active Recruitment Notices</h2>
          <div className="mt-5 space-y-4">
            <article className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">Technical Officer / Scientific Posts</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Open</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Review eligibility, upload documents, and submit before the closing date.</p>
              <Link href="/jobs/current/application" className="mt-3 inline-block text-sm font-semibold text-blue-700">
                View details →
              </Link>
            </article>
          </div>
        </aside>
      </section>
    </main>
  );
}
```

---

# 27. Applicant Portal Self-Service Requirements

The applicant portal shall be fully self-manageable by the applicant after login.

## 27.1 Applicant Self-Service Capabilities

Applicants shall be able to:

- Register using phone number or locally captured Aadhaar number
- Login using phone number or locally captured Aadhaar number
- Maintain profile details
- Maintain personal document vault
- Upload reusable documents once and attach them to multiple applications
- Edit draft applications before final submission
- Track payment status
- Download submitted application PDF
- View scrutiny remarks
- Respond to deficiencies
- Replace or upload additional documents when permitted
- View application status timeline
- Download admit card / call letter if enabled
- Update communication preferences

## 27.2 Applicant Document Vault

A document vault shall be linked to the applicant login and may include:

- Photo
- Signature
- Aadhaar local ID proof copy if collected
- Date of birth proof
- Community certificate
- EWS certificate
- PwBD certificate
- Educational certificates
- Experience certificates
- No Objection Certificate if applicable
- Other post-specific documents

Documents uploaded to the vault shall be reusable across applications. Each application shall store a snapshot reference of the selected document version to preserve audit integrity.

## 27.3 Document Versioning

```txt
Applicant uploads document
→ document stored in vault
→ applicant selects document for application
→ system snapshots document version/hash
→ final submission locks selected version
→ later vault changes do not alter submitted application
```

---

# 28. Login and Local Aadhaar Handling

## 28.1 Login Methods

The portal shall support login using:

1. **Phone number + OTP**
2. **Locally registered Aadhaar number + OTP / password**

## 28.2 Aadhaar Restriction Statement

Aadhaar shall be used only as a locally captured identity field for registration and applicant profile matching. The system shall **not integrate with UIDAI / real Aadhaar authentication servers** unless separately approved through the legally required process and competent authority.

Recommended procurement wording:

```txt
Aadhaar number, if collected, shall be used only as a locally stored applicant identifier for registration deduplication and profile reference. No live UIDAI authentication, e-KYC, biometric verification, or Aadhaar server integration shall be performed under this scope. Aadhaar data shall be encrypted, masked in UI, access-controlled, and processed strictly according to approved privacy and data-retention policy.
```

## 28.3 Aadhaar Data Protection Requirements

- Store Aadhaar number encrypted at application/database level
- Show only masked value such as `XXXX-XXXX-1234`
- Never log Aadhaar number in plaintext
- Never expose Aadhaar number in exports unless explicitly authorized
- Restrict access to admin roles with documented purpose
- Maintain audit trail for every view/update
- Provide DPDP consent text for collection and use

---

# 29. Airtable-Style Application List Page

## 29.1 Page Objective

The admin application list shall follow an Airtable-like data management experience with multiple views, colour-coded tags, fast filters, grouped records, and export options.

Route:

```txt
/app/admin/applications
```

or

```txt
/app/admin/scrutiny
```

## 29.2 Required Views

The application list page shall include saved views such as:

- All Applications
- By Post Applied
- Submitted Today
- Payment Pending
- Under Scrutiny
- Deficiency Raised
- Recommended
- Rejected
- Director Approval Pending
- Category-wise View
- PwBD View
- Export View

## 29.3 Airtable-Style UI Features

Required features:

- Sticky toolbar
- Search box
- Saved views tab bar
- Column visibility selector
- Group by post applied
- Group by category
- Filter by status
- Filter by payment status
- Filter by scrutiny stage
- Colour tags for category, status, payment, and OCR confidence
- Inline quick action buttons
- Row density selector
- Pagination / virtualized scrolling
- Export button based on selected post

## 29.4 Colour Tag Examples

| Tag Type | Example | Colour Intent |
|---|---|---|
| Status | Submitted | Blue |
| Status | Under Scrutiny | Amber |
| Status | Recommended | Green |
| Status | Rejected | Red |
| Payment | Success | Green |
| Payment | Pending | Orange |
| Category | UR | Slate |
| Category | OBC | Indigo |
| Category | SC/ST | Purple |
| OCR | Low Confidence | Rose |
| OCR | Verified | Emerald |

## 29.5 Export Behaviour

Export shall support:

- Export by post applied
- Export by saved view
- Export selected rows
- Export all filtered rows
- Export scrutiny remarks
- Export document checklist status
- Export payment reconciliation report
- Export CVC audit format

Export formats:

```txt
CSV, Excel, PDF summary, Audit JSON if required
```

All exports shall be audit-logged and generated using expiring signed download links.

---

# 30. Scrutiny Page — Quick Document Review UI

## 30.1 Scrutiny Page Objective

The scrutiny page shall allow officers to quickly review an applicant’s details, uploaded PDFs, photographs, signatures, certificates, OCR text, and eligibility result without excessive navigation.

## 30.2 Recommended Layout

```txt
Left Panel:
Application list / queue / filters

Center Panel:
Applicant profile, eligibility summary, form data, remarks

Right Panel:
Quick document preview drawer
```

## 30.3 Document Quick View Requirements

The document preview area shall support:

- PDF preview
- Image preview
- Photo preview
- Signature preview
- Certificate preview
- Zoom in/out
- Rotate
- Open in full screen
- Download if permitted
- OCR text panel
- OCR confidence display
- Mark verified / deficient
- Add document-specific remarks
- Compare document against entered form data

## 30.4 Scrutiny Action Buttons

Officer actions:

- Mark document verified
- Raise deficiency
- Recommend application
- Reject with reason
- Forward to reviewer
- Forward to director approval
- Add internal note
- Send applicant clarification request
- Download scrutiny sheet

All actions shall be captured in the immutable audit trail.

---

# 31. Advanced Settings Page

## 31.1 Page Objective

An advanced settings page shall allow authorized administrators to manage portal-wide configuration without direct code changes.

Route:

```txt
/admin/settings
```

## 31.2 Settings Modules

The settings page shall include:

### 31.2.1 Site Settings

- Portal title
- Organization name
- Logo / emblem path
- Helpdesk email
- Helpdesk phone
- Office address
- Footer text
- Maintenance mode
- Public notice banner
- Last updated date

### 31.2.2 Recruitment Settings

- Advertisement number
- Active posts
- Crucial date
- Application opening date
- Application closing date
- Fee rules
- Category matrix
- Eligibility rules
- Document checklist

### 31.2.3 SMTP Settings

- SMTP host
- SMTP port
- SMTP username
- SMTP password / secret reference
- From email
- Reply-to email
- TLS mode
- Test email button

### 31.2.4 Telegram Notification Settings

- Enable / disable Telegram
- Bot token secret reference
- Chat ID / channel ID
- Notification templates
- Test Telegram message
- Admin-only alert routing

### 31.2.5 Optional WhatsApp Notification Settings

- Enable / disable WhatsApp
- Approved provider name
- API endpoint
- Template IDs
- Consent requirement
- Fallback SMS/email behaviour
- Test notification

### 31.2.6 Security Settings

- Session timeout
- Admin MFA requirement
- Password policy
- OTP expiry
- OTP retry limit
- Rate limit configuration
- Allowed file types
- Maximum upload size
- IP allowlist for admin if required

### 31.2.7 UI / Accessibility Settings

- Default language
- High contrast mode availability
- Font scaling options
- Theme mode
- Reduced motion option
- Public banner visibility

## 31.3 Settings Security

- Only `ADMIN` role can edit settings
- Sensitive values shall be stored as encrypted secrets or secret references
- Every setting change shall create an audit log
- Previous value and new value shall be captured with masking for secrets
- Test notification actions shall be logged

---

# 32. Responsive Design and Screen Space Usage

## 32.1 Responsive Requirements

The portal shall be optimized for:

- Desktop monitors used by scrutiny/admin staff
- Laptops
- Tablets
- Mobile phones used by applicants
- Low bandwidth situations
- Keyboard-only navigation
- Screen readers

## 32.2 Screen Space Rules

- Use max-width containers for public pages
- Use full-width data layouts for admin pages
- Use sticky toolbars for tables
- Use collapsible sidebars for admin navigation
- Use drawers for document previews on medium screens
- Use bottom sheets for document previews on mobile
- Avoid excessive empty hero sections on mobile
- Keep primary CTAs above the fold
- Use progressive disclosure for complex settings

## 32.3 Applicant Portal Layout

Applicant pages shall use:

- Stepper progress indicator
- Autosave status
- Clear validation summary
- Sticky next/previous actions on mobile
- Document reuse panel
- Application status timeline
- Payment status widget
- Deficiency response section when applicable

---

# 33. Updated UI Component Plan

## 33.1 Public Portal Components

```txt
components/public/
├── GovtHeader.tsx
├── AccessibilityToolbar.tsx
├── RecruitmentHero.tsx
├── ActiveNoticeCard.tsx
├── ImportantDatesPanel.tsx
├── RuleSummaryCard.tsx
├── ApplicantSelfServicePanel.tsx
└── GovtFooter.tsx
```

## 33.2 Applicant Components

```txt
components/applicant/
├── ApplicantStepper.tsx
├── DocumentVault.tsx
├── DocumentPicker.tsx
├── AutosaveIndicator.tsx
├── EligibilityResultCard.tsx
├── PaymentStatusCard.tsx
├── ApplicationTimeline.tsx
└── DeficiencyResponsePanel.tsx
```

## 33.3 Admin Components

```txt
components/admin/
├── AirtableApplicationGrid.tsx
├── SavedViewsTabs.tsx
├── FilterBar.tsx
├── ColourTag.tsx
├── ExportMenu.tsx
├── ScrutinyQueue.tsx
├── ApplicantQuickView.tsx
├── DocumentPreviewPanel.tsx
├── ScrutinyActionBar.tsx
└── SettingsPanel.tsx
```

---

# 34. Updated Acceptance Criteria for UI/UX

| Area | Acceptance Criteria |
|---|---|
| Index Page | Glassmorphism hero, blue-green gradient, CSIR/Govt identity, responsive layout |
| Typography | Noto Sans for body, Montserrat for headings across portal |
| Accessibility | WCAG 2.1 AA contrast, keyboard navigation, screen reader labels |
| Application List | Airtable-like views, colour tags, filters, grouping, post-wise export |
| Scrutiny Page | Quick view of PDFs, images, photo, signature, OCR text, document remarks |
| Settings Page | SMTP, Telegram, optional WhatsApp, site settings, recruitment settings, security settings |
| Login | Phone number or locally captured Aadhaar login; no real Aadhaar server integration |
| Applicant Portal | Self-managed profile, document vault, reusable documents, draft autosave, status tracking |
| Responsiveness | Works well on desktop, tablet, and mobile with responsible screen-space usage |

---

# 35. Updated Package Recommendations for UI

```json
{
  "dependencies": {
    "@heroui/react": "latest",
    "@fluentui/react-components": "latest",
    "framer-motion": "latest",
    "lucide-react": "latest",
    "@tanstack/react-table": "latest",
    "@tanstack/react-virtual": "latest",
    "react-pdf": "latest",
    "pdfjs-dist": "latest",
    "next-themes": "latest"
  }
}
```

Recommended usage:

```txt
Hero UI: Public portal, applicant forms, cards, modals, buttons
Fluent UI: Admin settings, command bars, dense tables, enterprise form controls
TanStack Table: Airtable-style application list and scrutiny queue
React PDF / PDF.js: Document quick preview
Framer Motion: Subtle transitions, respecting reduced-motion settings
```

---

# 36. Updated Final UI Statement

```txt
The portal UI shall follow a modern CSIR/Government recruitment design language using Hero UI or Fluent UI, Noto Sans body typography, Montserrat heading typography, blue-green institutional colours, glassmorphism panels, gradients, accessible contrast, responsive layouts, Airtable-style administrative data grids, document quick-preview scrutiny workflows, configurable notification settings, and a self-service applicant dashboard with reusable preloaded document vault. Login shall support phone number and locally registered Aadhaar identifier only, without any live Aadhaar/UIDAI server integration under this scope.
```


**End of Document**
