# Scheme Sathi — Technical Requirements Specification

## 1. System Overview

Scheme Sathi uses a hybrid architecture:

```text
Citizen
   ↓
Next.js Frontend
   ↓
Next.js API Route
   ↓
Deterministic Benefit Engine
 ┌───────────────┬───────────────┬───────────────┐
 ↓               ↓               ↓
Eligibility    Conflicts      Bundle/Optimizer
 └───────────────┴───────────────┴───────────────┘
                       ↓
                  Gemini Layer
                       ↓
              Planning / Explanation
                       ↓
                 Results Response
```

Primary design rule:

**Deterministic code is the source of truth for eligibility and compatibility. Gemini is the orchestration, personalization and explanation layer.**

---

## 2. Locked Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide

### Backend
- Next.js Route Handlers

### Business Logic
- TypeScript

### Knowledge Base
- JSON

### AI
- Gemini API

### Deployment
- Vercel

---

## 3. Recommended Project Structure

```text
scheme-sathi/
├── app/
│   ├── page.tsx
│   ├── find-benefits/
│   │   └── page.tsx
│   ├── analysis/
│   │   └── page.tsx
│   ├── results/
│   │   ├── page.tsx
│   │   ├── bundle/
│   │   │   └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   └── application-plan/
│   │       └── page.tsx
│   ├── scheme/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── how-it-works/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── api/
│       └── analyze/
│           └── route.ts
│
├── components/
│   ├── CitizenForm.tsx
│   ├── SchemeCard.tsx
│   ├── EligibilityBadge.tsx
│   ├── ConflictCard.tsx
│   ├── BundleCard.tsx
│   ├── BundleScore.tsx
│   ├── AgentActivity.tsx
│   ├── DocumentChecklist.tsx
│   ├── ApplicationTimeline.tsx
│   └── AnalysisLoader.tsx
│
├── lib/
│   ├── eligibility.ts
│   ├── conflicts.ts
│   ├── bundles.ts
│   ├── optimizer.ts
│   ├── documents.ts
│   ├── checklist.ts
│   ├── gemini.ts
│   └── types.ts
│
├── data/
│   └── schemes.seed.json
│
├── public/
│
├── .env.local
├── package.json
└── README.md
```

---

## 4. Core Type Model

Suggested TypeScript types:

```ts
type CitizenProfile = {
  age: number;
  gender?: string;
  state: string;
  district: string;
  annualIncome: number;
  occupation: string;
  category?: string;
  isStudent: boolean;
  hasDisability: boolean;
  familySize: number;
  existingBenefits?: string[];
  documents: DocumentStatus[];
};

type DocumentStatus = {
  type: string;
  available: boolean;
};

type Scheme = {
  id: string;
  name: string;
  category: string;
  source: {
    name: string;
    url: string;
    lastVerified: string;
  };
  eligibility: Record<string, unknown>;
  benefit: Record<string, unknown>;
  documents: string[];
  conflictsWith: string[];
  application: {
    portalUrl?: string;
    steps?: string[];
  };
};

type EligibilityResult = {
  schemeId: string;
  status: "potentially_eligible" | "not_eligible" | "insufficient_data";
  reasons: string[];
  matchedRules?: string[];
  failedRules?: string[];
};

type Conflict = {
  schemeA: string;
  schemeB: string;
  reason: string;
};

type Bundle = {
  schemeIds: string[];
  score: number;
  breakdown: {
    relevance: number;
    benefitValue: number;
    priority: number;
    applicationEffort: number;
    compatibility: number;
  };
  reasons: string[];
};

type AnalysisResult = {
  evaluatedCount: number;
  eligibilityResults: EligibilityResult[];
  conflicts: Conflict[];
  compatibleSchemes: string[];
  bundles: Bundle[];
  recommendedBundle?: Bundle;
  documents: DocumentStatus[];
  missingDocuments: string[];
  applicationPlan: ApplicationStep[];
  explanation?: string;
};

type ApplicationStep = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "current" | "complete";
  schemeIds?: string[];
  action?: {
    label: string;
    url?: string;
  };
};
```

Types may be refined during implementation but the separation of concerns must remain.

---

## 5. Scheme JSON Requirements

Example structure:

```json
{
  "id": "scheme_001",
  "name": "Official Scheme Name",
  "category": "Education",
  "source": {
    "name": "myScheme",
    "url": "https://example.gov.in",
    "lastVerified": "2026-09-11"
  },
  "eligibility": {
    "states": ["Maharashtra"],
    "occupation": ["student"],
    "incomeMax": 250000
  },
  "benefit": {
    "type": "financial_assistance",
    "value": 10000
  },
  "documents": [
    "aadhaar",
    "income_certificate"
  ],
  "conflictsWith": [],
  "application": {
    "portalUrl": "https://example.gov.in",
    "steps": []
  }
}
```

Actual eligibility, benefits, documents and restrictions must come from verified official sources.

Never fabricate government rules.

---

## 6. Eligibility Engine

File:

`lib/eligibility.ts`

### Requirements
- Pure TypeScript logic
- Deterministic
- Testable without Gemini
- Returns reasons with every decision
- Handles missing fields explicitly

### Pseudoflow

```text
for each scheme:
    validate required citizen fields
    evaluate each configured rule
    collect matched rules
    collect failed rules

    if required information is missing:
        status = insufficient_data

    else if any mandatory rule fails:
        status = not_eligible

    else:
        status = potentially_eligible
```

The engine must never call Gemini.

---

## 7. Conflict Engine

File:

`lib/conflicts.ts`

### Requirements
- Deterministic
- Check configured `conflictsWith`
- Avoid duplicate conflict pairs
- Return a human-readable reason

Example normalization:

```text
(A, B)
(B, A)

→ one conflict only
```

---

## 8. Bundle Generation

File:

`lib/bundles.ts`

Candidate schemes:
- potentially eligible only
- no missing mandatory information
- compatible with current selection

Generate combinations without creating invalid bundles.

For the prototype, bundle generation may use bounded combination search because the scheme universe is only ~15–20 schemes.

Do not introduce an external optimization framework.

---

## 9. Bundle Optimization

File:

`lib/optimizer.ts`

Use configurable weights.

Example:

```ts
const WEIGHTS = {
  benefitValue: 0.30,
  relevance: 0.25,
  priority: 0.15,
  applicationEffort: 0.10,
  eligibilityConfidence: 0.20,
  conflictPenalty: 1.0
};
```

These are implementation examples, not government facts.

Normalize each score to a consistent range before calculating a final bundle score.

Required output:
- total score
- score breakdown
- reasons
- competing bundles

Optimization must never select a bundle containing a detected conflict.

---

## 10. Document Engine

File:

`lib/documents.ts`

Inputs:
- scheme required documents
- citizen available documents

Outputs:
- available documents
- missing documents
- document readiness ratio

No OCR.
No real document verification.
No DigiLocker.

---

## 11. Application Checklist Engine

File:

`lib/checklist.ts`

Build application steps from:
- recommended bundle
- missing documents
- scheme application metadata

Output must be deterministic.

Gemini may rewrite or personalize descriptions, but not invent application steps or URLs.

---

## 12. Gemini Layer

File:

`lib/gemini.ts`

Gemini is responsible for:
- orchestrating the workflow
- calling application tools/functions
- personalizing explanations
- summarizing the deterministic results

Gemini must NOT directly decide:
- eligibility
- conflict rules
- government benefit amounts
- required documents
- official URLs

The server should pass deterministic results to Gemini and restrict the model to those facts.

### Recommended response format

Use structured JSON from Gemini for:
- concise explanation
- bundle rationale
- next-step wording

Validate the response before returning it to the client.

If validation fails, use a deterministic fallback message.

---

## 13. API Requirements

Primary endpoint:

`POST /api/analyze`

### Request

```json
{
  "profile": {
    "age": 22,
    "state": "Maharashtra",
    "district": "Pune",
    "annualIncome": 250000,
    "occupation": "student",
    "category": "OBC",
    "isStudent": true,
    "hasDisability": false,
    "familySize": 4,
    "documents": [
      {"type": "aadhaar", "available": true},
      {"type": "income_certificate", "available": true},
      {"type": "caste_certificate", "available": true}
    ]
  }
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "evaluatedCount": 20,
    "eligibilityResults": [],
    "conflicts": [],
    "compatibleSchemes": [],
    "bundles": [],
    "recommendedBundle": null,
    "documents": [],
    "missingDocuments": [],
    "applicationPlan": [],
    "explanation": ""
  }
}
```

### Error responses

Use predictable error codes:

- `INVALID_PROFILE`
- `MISSING_REQUIRED_FIELD`
- `SCHEME_DATA_ERROR`
- `ANALYSIS_FAILED`
- `AI_UNAVAILABLE`

The API should return enough information for the frontend to show a useful fallback state.

---

## 14. Agent Orchestration

The logical workflow is:

```text
1. Receive validated citizen profile
2. Load scheme knowledge
3. evaluateEligibility()
4. detectConflicts()
5. generateBundles()
6. optimizeBundle()
7. checkDocuments()
8. generateChecklist()
9. Gemini personalizes explanation
10. Return complete analysis
```

The UI agent timeline must reflect these actual stages.

Do not simulate steps that are not executed.

---

## 15. API Security

- Keep `GEMINI_API_KEY` server-side
- Never expose secrets to the browser
- Validate all incoming profile fields
- Reject malformed requests
- Do not log unnecessary PII
- Avoid persisting citizen data unless explicitly required
- Sanitize external URLs before rendering

---

## 16. Reliability Requirements

### Gemini unavailable
Eligibility, conflicts, optimization, documents and checklist must still complete.

### Invalid Gemini output
Discard invalid output and use deterministic fallback explanation.

### Scheme data unavailable
Fail clearly and do not show fabricated results.

### Missing profile fields
Return a validation error before expensive analysis.

---

## 17. Frontend State Requirements

The UI must represent:

- idle
- collecting profile
- analyzing
- completed
- partial/AI-degraded
- validation error
- system error
- no eligible schemes
- no compatible bundle

Do not hide failures behind fake success states.

---

## 18. Trust/UI Requirements

Use the exact UI status:

**Potentially Eligible**

Never:

**Officially Eligible**

Display:

**Official Source**

**Last Verified**

Document status:

**Marked available by citizen**

Do not display “verified” unless the system actually performed verification through a trusted external system.

---

## 19. Performance Targets

For the hackathon prototype:

- Client navigation should feel immediate
- Deterministic analysis should be fast
- Scheme JSON should load locally/server-side
- Bundle search should remain bounded for 15–20 schemes
- AI calls should happen only when needed
- Results should not wait for Gemini when deterministic fallback is available

---

## 20. Testing Requirements

Minimum test coverage:

### Eligibility
- valid eligible case
- valid ineligible case
- missing information
- boundary income
- boundary age

### Conflicts
- explicit conflict
- reversed conflict pair
- no conflict

### Bundles
- single-scheme bundle
- multi-scheme bundle
- no compatible bundle
- conflict-containing candidate rejected

### Documents
- all available
- all missing
- partial availability

### API
- valid request
- invalid request
- AI unavailable
- malformed AI response

---

## 21. Non-Functional Requirements

### Accessibility
- keyboard-friendly forms
- visible focus state
- readable labels
- sufficient color contrast
- do not use color as the only status indicator

### Maintainability
- business logic separated from UI
- reusable types
- reusable components
- scheme data isolated from logic

### Explainability
Every recommendation must have a machine-readable reason set.

---

## 22. Definition of Done

The implementation is complete when:

- a citizen can enter a profile
- schemes are evaluated through deterministic rules
- conflicts are detected
- compatible bundles are generated
- a recommended bundle is selected
- documents are checked
- an application plan is generated
- Gemini can personalize the explanation
- the system still works when Gemini is unavailable
- results do not claim official government eligibility
- all demo data is derived from configured rules
