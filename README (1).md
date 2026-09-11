# Scheme Sathi

**Smarter access to government benefits.**

Scheme Sathi is a hackathon prototype for **PS16 — Autonomous Scheme-Bundle Optimizer for Citizens**.

It helps citizens understand:

- which government schemes they may be eligible for
- which schemes can work together
- which schemes conflict
- which bundle is most useful for them
- which documents are missing
- what to do next

> **Government complexity behind the scenes. Simplicity for the citizen.**

---

## Problem

A citizen may qualify for several government schemes, but comparing schemes, checking eligibility, understanding incompatibilities, and preparing documents can be difficult when information is spread across different portals.

Scheme Sathi turns that process into one guided workflow.

---

## Core Flow

```text
Citizen Profile
      ↓
Scheme Knowledge Base
      ↓
Eligibility Engine
      ↓
Conflict Detection
      ↓
Bundle Generation
      ↓
Bundle Optimization
      ↓
Document Check
      ↓
Application Plan
      ↓
Personalized Explanation
```

---

## What Makes It Different?

Scheme Sathi is not only a scheme search tool.

It moves from:

> “Which schemes exist?”

to:

> “Which schemes might I qualify for, which can work together, which combination is most useful for me, what am I missing, and what should I do next?”

---

## Hybrid AI Architecture

Scheme Sathi uses a hybrid architecture.

### Deterministic engine

Used for high-trust decisions:
- eligibility
- conflict detection
- bundle validation
- optimization
- document readiness
- application checklist

### Agentic AI

Gemini is used for:
- workflow orchestration
- tool invocation
- planning
- personalization
- explanation

The LLM does **not** directly decide government eligibility.

---

## Agent Tools

Conceptual tools:

```text
evaluateEligibility()
detectConflicts()
generateBundles()
optimizeBundle()
checkDocuments()
generateChecklist()
```

The agent workflow is visible to the user through an activity timeline.

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide

### Backend
- Next.js Route Handlers

### Logic
- TypeScript

### Knowledge Base
- JSON

### AI
- Gemini API

### Deployment
- Vercel

---

## Scheme Knowledge Base

The hackathon prototype uses a curated set of approximately **15–20 verified schemes**.

The dataset is intentionally small enough to be reliable and demoable.

Primary source:
- myScheme

Maharashtra sources:
- MahaDBT
- Maharashtra government department portals
- other verified official Maharashtra sources

The prototype does not depend on live scraping for the demo.

---

## Trust & Safety

Scheme Sathi is a decision-support tool, not a government authority.

The UI uses:

**Potentially Eligible**

instead of:

**Officially Eligible**

Every scheme should show:
- official source
- last verified date

Document status is explicitly shown as:

**Marked available by citizen**

The system does not claim to verify uploaded documents.

Government applications are not submitted by Scheme Sathi.

---

## Main Pages

```text
/
├── /find-benefits
├── /analysis
├── /results
├── /results/bundle
├── /scheme/[id]
├── /results/documents
├── /results/application-plan
├── /how-it-works
└── /about
```

---

## Project Structure

```text
scheme-sathi/
├── app/
│   ├── page.tsx
│   ├── find-benefits/
│   ├── analysis/
│   ├── results/
│   ├── scheme/[id]/
│   ├── how-it-works/
│   ├── about/
│   └── api/analyze/
├── components/
├── lib/
│   ├── eligibility.ts
│   ├── conflicts.ts
│   ├── bundles.ts
│   ├── optimizer.ts
│   ├── documents.ts
│   ├── checklist.ts
│   ├── gemini.ts
│   └── types.ts
├── data/
│   └── schemes.json
├── public/
├── .env.local
└── README.md
```

---

## Local Setup

### 1. Clone

```bash
git clone <repository-url>
cd scheme-sathi
```

### 2. Install

```bash
npm install
```

### 3. Environment variables

Create `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

Never expose the key to client-side code.

### 4. Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Demo Profile

Recommended hackathon demo:

```text
Age: 22
State: Maharashtra
District: Pune
Annual Income: ₹2,50,000
Occupation: Student
Category: OBC
Student: Yes
Disability: No
Family Size: 4
```

Available documents:

```text
Aadhaar
Income Certificate
Caste Certificate
```

The final result counts and bundle are generated dynamically from the configured scheme rules.

---

## Reliability

If Gemini is unavailable, the system should still provide:

```text
Eligibility ✓
Conflicts ✓
Optimization ✓
Documents ✓
Application Plan ✓
AI Explanation unavailable
```

The core product must not depend on an LLM for factual eligibility decisions.

---

## Scope

### Included
- curated scheme knowledge base
- deterministic eligibility
- conflict detection
- bundle generation
- bundle optimization
- document readiness
- application planning
- agentic orchestration
- personalized explanation

### Not included
- DigiLocker
- mobile app
- 1000+ live schemes
- ML model training
- vector database
- LangChain/LangGraph
- Kubernetes
- microservices
- complex authentication
- admin dashboard
- payments
- government application submission

---

## Demo Story

```text
1. Citizen enters profile
2. Scheme Sathi analyzes the profile
3. Eligibility rules are evaluated
4. Conflicts are detected
5. Compatible bundles are generated
6. Best bundle is selected
7. Missing documents are shown
8. Application plan is created
9. Official portal is opened for the citizen
```

---

## Why Not Just myScheme?

myScheme is useful for discovering individual government schemes.

Scheme Sathi focuses on the decision layer after discovery:

- evaluate multiple schemes together
- detect conflicts
- generate compatible bundles
- optimize the bundle
- identify document gaps
- create an application plan

---

## Why Agentic AI?

The AI layer does more than generate text.

It orchestrates a multi-step workflow, uses specialized tools, and combines deterministic results into a personalized plan.

The deterministic engine remains the source of truth for government eligibility and compatibility.

---

## Future Scalability

The prototype intentionally uses a small curated knowledge base.

The architecture allows:
- expanding the scheme catalogue
- moving scheme data from JSON to a database
- scaling API execution
- independently maintaining scheme data
- extending the optimization engine

The core reasoning pipeline does not need to be redesigned when the knowledge base grows.

---

## License

Add the team's chosen license before public release.

---

## Status

**Hackathon Prototype — PS16**

Built to demonstrate an explainable, reliable, agentic approach to citizen benefit discovery and scheme-bundle optimization.
