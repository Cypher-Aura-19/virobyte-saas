# AGENTS.md — Developer & AI Agent Guide for Virobyte SaaS

Welcome to **Virobyte SaaS**. This document is the primary onboarding guide for coding agents and developers working on this codebase. It documents what the system is, what has been completed, key architectural invariants, and where to pick up next.

---

## 1. Project Mission & Core Value Proposition

**Virobyte SaaS** is an AI-powered workflow automation platform designed for local service businesses (initial niche: **single-location cleaning companies**).

### The Core Problem Solved
Small cleaning business owners miss revenue due to unhandled customer inquiries on WhatsApp during jobs, and waste hours manually coordinating bookings, calculating quotes, and entering leads into calendars and spreadsheets.

### The Product Promise
1. A business configures their services, pricing, and availability.
2. Connects their existing channels: **WhatsApp Business**, **Google Calendar**, and **Google Sheets**.
3. Virobyte automatically engages incoming WhatsApp inquiries, checks availability, reserves slots without double-booking, and mirrors leads to Google Sheets.
4. Seamlessly routes edge cases, complaints, or custom requests to human operators (**W3 Exception Handling**).

---

## 2. Core Architectural Invariant: "Bounded Intelligence"

> [!IMPORTANT]
> **AI interprets unstructured text; deterministic code executes state changes.**
> - **Generative AI** is used *strictly* to extract structured data (customer name, service type, area, requested date/time) and draft polite replies within approved knowledge.
> - **Ordinary code** executes pricing calculations, calendar free/busy checks, concurrency slot holds in PostgreSQL, and external writes.
> - AI models are **never** granted permission to execute arbitrary code, invent prices, or override business policies.

---

## 3. UI/UX Design System Guidelines

The frontend uses **Vanilla CSS** (`src/index.css`) with React 19:
- **Spacious & Clean:** Ample whitespace (padding 32px–56px), clean typography (`Inter`), and hairline borders (`#e2e8f0`).
- **Color Palette:** Clean slate (`#0f172a`), neutral background (`#f8fafc`), white cards (`#ffffff`), and emerald green accents (`#059669`).
- **STRICT CONSTRAINT:** **NO purple shades, NO gaudy gradients, and NO congested multi-tab menus.**
- **Main Navigation:** Kept strictly to **4 clear, essential sections**:
  1. `Overview`: High-level outcomes (*Leads Captured*, *Bookings Confirmed*, *Hours Saved*) & 3-step automation diagram.
  2. `WhatsApp Simulator`: High-fidelity phone preview to test inbound messages, inspect AI extraction, and verify ledger actions.
  3. `Services & Pricing`: Service catalog (with prices in minor integer units) and booking rules.
  4. `Connected Accounts`: Integration cards for WhatsApp, Google Calendar, and Google Sheets with live status.

---

## 4. Completed Work (Sprint 1 & Sprint 2)

### ✅ Sprint 1: Multi-Tenant Core, RLS & RBAC Foundation
- **Multi-Tenant Scoping:** Two synthetic businesses seeded to verify strict isolation:
  - *Sparkle & Shine Cleaning Co.* (`org_sparkle_01`, New York, `America/New_York`)
  - *Apex Facility & Commercial Services* (`org_apex_02`, Austin, `America/Chicago`)
- **Role-Based Access Control (RBAC):** `owner`, `manager`, `operator`, and `platform_support`. Operators are strictly blocked from editing pricing or accessing billing.
- **Data Integrity & Minor Units:** All monetary values stored as non-negative integer cents (e.g., $140.00 is stored as `14000`).
- **Automated Tenant Security Suite:** Built-in verification tool that tests cross-tenant read/write barriers and RLS rules live.
- **Immutable Audit Trail:** Logging sensitive modifications with actor ID, role, and timestamps.

### ✅ Sprint 2: Connectors Hub, Destination Bindings & Staging Simulator
- **Connector Layer Contracts (`src/types/domain.ts`):** `ConnectorBinding` abstractions for WhatsApp, Google Calendar, Google Sheets, and Resend email alerts.
- **Destination Bindings:** Explicit mappings for `selectedCalendarId`, `selectedSheetId`, `selectedSheetTab`, and `alertEmailRecipient`.
- **Interactive Staging Simulator (`src/lib/simulatorEngine.ts`):**
  - Live execution engine that simulates the 3 core workflows:
    - **W1 (Lead Capture):** Inbound message $\rightarrow$ AI extraction $\rightarrow$ Lead record $\rightarrow$ Google Sheets upsert.
    - **W2 (Confirmed Appointment):** Availability search $\rightarrow$ slot proposal $\rightarrow$ simulated PostgreSQL interval lock $\rightarrow$ Calendar event creation.
    - **W3 (Human Takeover):** Detects out-of-area requests, complaints, or human requests $\rightarrow$ pauses bot $\rightarrow$ creates operator review alert.
  - **Zero-Write Guarantee:** All simulated writes are logged to the local `ActionLedger` without side-effects.

---

## 5. Where to Start Next: Sprint 3 (Phase 2, Iteration 3)

The next developer/agent should implement **Sprint 3: Webhook Ingestion Engine & Backend W1 Lead Capture**:

### Key Tasks for Sprint 3
1. **Webhook Ingestion Endpoint (`/webhooks/whatsapp`):**
   - Implement HMAC-SHA256 signature verification for inbound Twilio/Meta webhooks.
   - Return HTTP `200 OK` within 2 seconds.
2. **Transactional Outbox Pattern:**
   - Write inbound event to `webhook_events` and queued job to `outbox` in a single PostgreSQL transaction to prevent message loss on server crashes.
3. **Queue Dispatcher with BullMQ & Redis:**
   - Asynchronous worker in `apps/worker` to process outbox entries.
   - Message deduplication by provider message ID.
4. **Structured AI Model Adapter (`packages/ai`):**
   - Server-side model adapter (OpenAI / Anthropic) with strict JSON schema output:
     `{ intent, customerName, serviceRequested, area, preferredTime, needsHuman }`.
5. **Production W1 Workflow Pipeline:**
   - WhatsApp text $\rightarrow$ AI schema extraction $\rightarrow$ business rule validation $\rightarrow$ PostgreSQL lead save $\rightarrow$ Google Sheets API row append $\rightarrow$ Resend transactional email to staff $\rightarrow$ WhatsApp confirmation reply.
   - Enforce WhatsApp 24-hour customer service messaging window.

---

## 6. How to Run Locally

```bash
# Install dependencies
npm install

# Start development server (Runs on port 3001)
npm run dev

# Run TypeScript compilation and build check
npm run build
```

*Note: Vite dev server is configured on **port 3001** (`http://localhost:3001/`). Keep this port configuration intact.*

---

## 7. Relevant Documentation Links

- Full Blueprint & 12-Sprint Roadmap: [`PROJECT_PLAN_AND_SPRINTS.md`](./PROJECT_PLAN_AND_SPRINTS.md)
- Product Blueprint PDF: [`AI_Workflow_SaaS_Implementation_Guide.pdf`](./AI_Workflow_SaaS_Implementation_Guide.pdf)
