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

- **[AGENTS.md](./AGENTS.md):** Architectural guide and onboarding instructions for AI agents and developers.
- **[PROJECT_PLAN_AND_SPRINTS.md](./PROJECT_PLAN_AND_SPRINTS.md):** Complete 12-sprint delivery roadmap, data models, and risk register.
- **[AI_Workflow_SaaS_Implementation_Guide.pdf](./AI_Workflow_SaaS_Implementation_Guide.pdf):** Original architectural specification blueprint.
