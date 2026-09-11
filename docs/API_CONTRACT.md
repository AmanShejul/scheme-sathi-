# Analysis API Contract

This document defines the shared contract for the future deterministic analysis endpoint. The endpoint is not implemented yet.

## `POST /api/analyze`

### Request

```json
{
  "citizenProfile": "CitizenProfile",
  "availableDocuments": ["Aadhaar", "Income Certificate"]
}
```

The `citizenProfile` value uses the shared `CitizenProfile` type from `src/types/citizen-profile.ts`. `availableDocuments` contains document names marked available by the citizen.

### Response

```json
{
  "eligibilityResults": "EligibilityResult[]",
  "conflicts": "ConflictResult[]",
  "recommendedBundle": "Bundle | null",
  "missingDocuments": "MissingDocument[]",
  "applicationPlan": "ApplicationStep[]"
}
```

The response uses `AnalyzeResponse` from `src/types/analysis-types.ts`. `AnalysisResult` is an equivalent alias for the same response shape.

### Eligibility statuses

Eligibility results may use only these statuses:

- `potentially_eligible`
- `not_eligible`
- `insufficient_data`

Eligibility is based on configured scheme rules and should be confirmed with the official authority.