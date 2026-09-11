import type { CitizenProfile } from "@/types/citizen-profile";
import { initialCitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

import { evaluateEligibility } from "./eligibilityEngine";

const developmentScheme: Scheme = {
  id: "eligibility-engine-example",
  name: "Development Eligibility Example",
  category: "development-placeholder",
  developmentOnly: true,
  source: {
    name: "Development example",
    url: "https://example.com/development-example",
    lastVerified: null,
  },
  eligibility: {
    minAge: 18,
    maxIncome: 300000,
    states: ["Example State"],
    student: false,
  },
  benefit: {
    type: "placeholder",
    amount: null,
    description: "Development-only test data.",
  },
  documents: [],
  conflictsWith: [],
  application: {
    mode: "placeholder",
    portalUrl: null,
    steps: [],
  },
};

const eligibleProfile: CitizenProfile = {
  ...initialCitizenProfile,
  age: "24",
  annualIncome: "250000",
  state: "Example State",
  studentStatus: "No",
};

const notEligibleProfile: CitizenProfile = {
  ...eligibleProfile,
  age: "16",
};

const insufficientDataProfile: CitizenProfile = {
  ...initialCitizenProfile,
  state: "Example State",
};

export const eligibilityEngineExamples = [
  {
    name: "eligible profile",
    result: evaluateEligibility(eligibleProfile, developmentScheme),
    expectedStatus: "potentially_eligible" as const,
  },
  {
    name: "not eligible profile",
    result: evaluateEligibility(notEligibleProfile, developmentScheme),
    expectedStatus: "not_eligible" as const,
  },
  {
    name: "insufficient profile data",
    result: evaluateEligibility(insufficientDataProfile, developmentScheme),
    expectedStatus: "insufficient_data" as const,
  },
];
