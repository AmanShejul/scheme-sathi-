import type { CitizenProfile } from "@/types/citizen-profile";
import { initialCitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

import { evaluateEligibility } from "./eligibilityEngine";

const baseScheme: Scheme = {
  id: "eligibility-example",
  name: "Eligibility Engine Example",
  category: "development-example",
  developmentOnly: true,
  source: { name: "Development example", url: "https://example.com/example", lastVerified: null },
  eligibility: {},
  benefit: { type: "placeholder", amount: null, description: "Development-only test data." },
  documents: [],
  conflictsWith: [],
  application: { mode: "placeholder", portalUrl: null, steps: [] },
};

const studentOBCProfile: CitizenProfile = {
  ...initialCitizenProfile,
  age: "22",
  state: "Maharashtra",
  occupation: "Student",
  category: "OBC",
  studentStatus: "Yes",
  disabilityStatus: "No",
  annualIncome: "Rs. 1 lakh - Rs. 3 lakh",
};

const farmerProfile: CitizenProfile = {
  ...initialCitizenProfile,
  age: "40",
  state: "Maharashtra",
  occupation: "farmer",
};

const examples = {
  studentOBC: evaluateEligibility(studentOBCProfile, {
    ...baseScheme,
    id: "student-obc-example",
    eligibility: { occupation: ["student"], social_category: ["OBC"], state: "maharashtra", income_limit: 300000 },
  }),
  farmer: evaluateEligibility(farmerProfile, {
    ...baseScheme,
    id: "farmer-example",
    eligibility: { occupation: ["farmer"], state: "Maharashtra" },
  }),
  ageFailure: evaluateEligibility({ ...studentOBCProfile, age: "16" }, {
    ...baseScheme,
    id: "age-failure-example",
    eligibility: { min_age: 18 },
  }),
  stateFailure: evaluateEligibility(studentOBCProfile, {
    ...baseScheme,
    id: "state-failure-example",
    eligibility: { state: "Karnataka" },
  }),
  missingInformation: evaluateEligibility({ ...studentOBCProfile, state: "" }, {
    ...baseScheme,
    id: "missing-state-example",
    eligibility: { state: "Maharashtra" },
  }),
  unsupportedCondition: evaluateEligibility(studentOBCProfile, {
    ...baseScheme,
    id: "unsupported-condition-example",
    eligibility: { occupation: ["student"], academic_merit_required: true },
  }),
  normalizedValues: evaluateEligibility({ ...studentOBCProfile, state: "maharashtra", occupation: "STUDENT" }, {
    ...baseScheme,
    id: "normalization-example",
    eligibility: { state: "Maharashtra", occupation: ["student"] },
  }),
};

export const eligibilityEngineExamples = examples;

export function runEligibilityEngineExamples() {
  const expected: Array<[keyof typeof examples, string]> = [
    ["studentOBC", "potentially_eligible"],
    ["farmer", "potentially_eligible"],
    ["ageFailure", "not_eligible"],
    ["stateFailure", "not_eligible"],
    ["missingInformation", "insufficient_data"],
    ["unsupportedCondition", "insufficient_data"],
    ["normalizedValues", "potentially_eligible"],
  ];

  expected.forEach(([name, status]) => {
    if (examples[name].status !== status) {
      throw new Error(`${name} expected ${status}, received ${examples[name].status}`);
    }
  });

  return examples;
}
