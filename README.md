# Virobyte SaaS — AI Workflow Automation for Local Service Businesses

Virobyte is a bounded AI workflow automation platform that eliminates missed inquiries, automates calendar scheduling, and syncs leads for local service companies (initial focus: small cleaning businesses).

## Key Features

- **WhatsApp Business AI Assistant:** Inbound customer inquiries are automatically greeted, quoted, and guided through booking.
- **Bounded Intelligence Guarantee:** Generative AI is strictly used for structured entity extraction and polite drafting. Price calculations, calendar booking slots, and external state changes are executed by deterministic code.
- **Google Calendar & Sheets Sync:** Confirmed appointments are inserted into Google Calendar with concurrency locks (zero double-bookings). Inquiries are mirrored directly into Google Sheets.
- **Seamless Human Takeover (W3):** Any complaint, out-of-area request, or human request automatically pauses the bot and notifies staff.
- **Multi-Tenant & RBAC:** Complete data isolation between businesses with Row-Level Security (RLS) and strict role access controls (`owner`, `manager`, `operator`).
- **Interactive Staging Simulator:** Dry-run test harness to simulate end-to-end customer conversations with zero external writes.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher, tested on v24)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Cypher-Aura-19/virobyte-saas.git
cd virobyte-saas

# Install dependencies
npm install

# Start development server on port 3001
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) in your browser.

---

## Documentation

The project's architectural standards, execution tracking, and product blueprints are consolidated under the [`docs/`](./docs/) directory into **Three Canonical Sources of Truth**:

- **[`docs/AI_Workflow_SaaS_Implementation_Guide.pdf`](./docs/AI_Workflow_SaaS_Implementation_Guide.pdf):** Master product & engineering blueprint (the immutable reference specification).
- **[`docs/AGENTS.md`](./docs/AGENTS.md):** Operating and educational standard for developers and AI agents, defining coding guidelines, architectural invariants, git policies, and the "teach-as-you-build" verification protocol.
- **[`docs/CHECKLIST.md`](./docs/CHECKLIST.md):** Complete master architecture, database schema, end-to-end system flow diagrams, and granular full-stack `Sprint -> Module -> Feature` execution tracker.
