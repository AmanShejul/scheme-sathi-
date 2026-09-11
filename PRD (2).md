# Scheme Sathi — Product Requirements Document (PRD)

## 1. Product Overview

**Product:** Scheme Sathi  
**Tagline:** Smarter access to government benefits.  
**Hackathon Problem:** PS16 — Autonomous Scheme-Bundle Optimizer for Citizens  
**Domain:** AI/ML + Agentic AI + GovTech

Scheme Sathi is a citizen decision-support system that helps a user understand which government schemes they may qualify for, which schemes may conflict, which combinations are compatible, what documents are missing, and what action to take next.

Scheme Sathi is not a government authority and does not submit applications on behalf of citizens.

---

## 2. Problem Statement

Citizens may qualify for multiple government schemes, but identifying the right combination is difficult because information is distributed across portals and scheme rules vary.

The user needs answers to five practical questions:

1. Which schemes may I qualify for?
2. Which schemes can work together?
3. Which combination is most useful for me?
4. What documents am I missing?
5. What should I do next?

---

## 3. Product Goal

Create a simple, trustworthy interface that turns a citizen profile into an explainable benefits plan.

### Core user journey

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

## 4. Primary Users

### Citizen
A person who wants to understand government schemes relevant to their situation.

### Hackathon Judge / Evaluator
A technical or domain expert who needs to quickly understand:
- the hybrid deterministic + AI architecture
- the bundle optimization concept
- the agentic workflow
- trust and explainability

---

## 5. Product Principles

### Reliability first
Government eligibility facts are decided by deterministic rules, not by the LLM.

### Explainability
Users should understand why a scheme or bundle appears in their results.

### Honest claims
Use **“Potentially Eligible”**, not “Officially Eligible”.

### Minimal data
Only collect information required for the analysis.

### Action-oriented
Every result should lead to a useful next step.

### Prototype transparency
The initial knowledge base is a curated hackathon dataset of verified schemes, not the complete Indian scheme ecosystem.

---

## 6. MVP Scope

### Must Have — P0
- Citizen profile form
- Curated scheme knowledge base
- Deterministic eligibility evaluation
- Conflict detection
- Compatible bundle generation
- Bundle optimization
- Results page
- Scheme details
- Document readiness
- Application plan

### Should Have — P1
- Agentic orchestration
- Agent activity timeline
- Gemini-generated personalized explanation
- Multiple citizen profiles
- Strong source/trust display

### Nice to Have — P2
- Micro-animations
- Extra UX polish
- Additional accessibility refinements

---

## 7. Out of Scope

The prototype will not build:
- DigiLocker integration
- Mobile app
- 1000+ live schemes
- ML model training
- Vector database
- LangChain/LangGraph
- Kubernetes
- Microservices
- Complex authentication
- Admin dashboard
- Payments
- Government application submission

---

## 8. Core Features

### 8.1 Citizen Profile

Collect:
- Age
- Gender
- State
- District
- Annual family income
- Occupation
- Category
- Student status
- Disability status
- Family size
- Existing benefits
- Document availability

The form is multi-step:
1. Personal
2. Eligibility
3. Documents
4. Review

---

### 8.2 Scheme Knowledge Base

Use a curated set of approximately 15–20 verified schemes.

Suggested mix:
- Education / Scholarship
- Skill / Employment
- Agriculture / Rural
- Housing / Basic Support
- Social Welfare / Other

Each scheme should include:
- unique ID
- official name
- category
- source
- last verified date
- eligibility rules
- benefit
- required documents
- conflicts
- application information

Primary source:
- myScheme

Maharashtra sources may include:
- MahaDBT
- Maharashtra government department portals
- other verified official Maharashtra scheme portals

The prototype should avoid live scraping dependencies.

---

### 8.3 Deterministic Eligibility Engine

The engine evaluates structured scheme rules against the citizen profile.

Possible result states:
- potentially eligible
- not eligible
- insufficient profile information

The engine must also provide reasons for rule outcomes.

Examples:
- age satisfied
- income threshold satisfied
- state requirement satisfied
- occupation mismatch
- category requirement not satisfied

---

### 8.4 Conflict Detection

Detect:
- explicit scheme conflicts
- configured incompatibilities
- mutually exclusive benefits
- duplicate/overlapping benefits where the scheme rules say they cannot coexist

The conflict engine must provide:
- scheme A
- scheme B
- conflict reason
- source/rule reference where applicable

---

### 8.5 Bundle Generation

Generate candidate combinations using schemes that are:
- potentially eligible
- compatible
- relevant to the citizen

A bundle is a set of schemes that can be selected together under the configured rules.

---

### 8.6 Bundle Optimization

The objective is not maximum rupee value alone.

Conceptual bundle score:

```text
Benefit Value
+ Citizen Relevance
+ Priority
+ Eligibility Confidence
- Application Effort
- Conflict Penalty
```

The implementation must use explicit configurable weights.

The UI should show why the winning bundle scored best.

---

### 8.7 Document Readiness

Document states:
- available
- missing
- not required

Citizen-provided document state must be labeled:

**“Marked available by citizen”**

The system must not claim government verification.

---

### 8.8 Application Plan

The system does not submit applications.

Plan:
1. Confirm profile
2. Collect missing documents
3. Open official scheme portal
4. Complete application
5. Submit
6. Track application status

---

### 8.9 Agentic AI

Gemini handles:
- workflow orchestration
- tool invocation
- planning
- personalization
- concise explanation

The LLM does not become the source of truth for eligibility.

Conceptual tools:
- `evaluateEligibility()`
- `detectConflicts()`
- `generateBundles()`
- `optimizeBundle()`
- `checkDocuments()`
- `generateChecklist()`

---

### 8.10 Explainable Agent Activity

The UI should show the agent process as a timeline:

- Understanding citizen profile
- Loading verified scheme knowledge
- Evaluating eligibility rules
- Detecting conflicts
- Generating possible bundles
- Optimizing compatible combinations
- Checking required documents
- Preparing application plan
- Generating personalized explanation

The activity is a transparent representation of actual backend steps, not simulated output.

---

## 9. Main Screens

### `/`
Landing page and entry point.

### `/find-benefits`
Multi-step citizen profile.

### `/analysis`
Agent workflow and progress.

### `/results`
Eligibility, conflicts, summary, and recommendation.

### `/results/bundle`
Bundle score, recommended combination, alternatives, exclusions.

### `/scheme/[id]`
Detailed scheme information.

### `/results/documents`
Document readiness.

### `/results/application-plan`
Application timeline and next step.

### `/how-it-works`
Architecture and hybrid AI explanation.

### `/about`
Problem, impact, and prototype context.

---

## 10. Golden Demo Profile

Use this demo profile during hackathon testing:

- Age: 22
- State: Maharashtra
- District: Pune
- Annual Income: ₹2,50,000
- Occupation: Student
- Category: OBC
- Student: Yes
- Disability: No
- Family Size: 4

Documents:
- Aadhaar
- Income Certificate
- Caste Certificate

Do not hardcode result counts. Results must be calculated from the configured rules.

---

## 11. Edge Cases

### Missing profile data
Block analysis until required fields are supplied.

### No potentially eligible schemes
Show:
> No potentially eligible schemes were found based on the information provided.

### No compatible bundle
Show:
> Eligible schemes were found, but no compatible combination could be created under the configured rules.

### AI unavailable
Core deterministic analysis must still work:
- eligibility
- conflicts
- optimization

Show:
> AI explanation unavailable. Core analysis completed successfully.

### Empty documents
Show document gaps without blocking results.

---

## 12. Trust & Safety

The product must:
- keep API keys server-side
- minimize stored PII
- show official sources
- show last verified date
- distinguish citizen-provided status from government verification
- keep deterministic rules as source of truth
- display a final eligibility disclaimer

Required disclaimer:
> Eligibility is based on configured scheme rules and should be confirmed with the official authority.

---

## 13. Success Criteria

The MVP is successful when a judge can complete this flow without assistance:

```text
Open Scheme Sathi
→ Enter profile
→ Analyze
→ See potentially eligible schemes
→ See conflicts
→ Open recommended bundle
→ Understand why it was selected
→ See missing documents
→ Open application plan
```

The demo should take only a few minutes and require no manual backend intervention.

---

## 14. Product USP

Scheme Sathi does not just answer:

> “Which schemes exist?”

It answers:

> “Which schemes might I qualify for, which can work together, which combination is most useful for me, what am I missing, and what should I do next?”
