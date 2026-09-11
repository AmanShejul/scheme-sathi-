import type { CitizenProfile } from "@/types/citizen-profile";
import { initialCitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

import { evaluateEligibility } from "./eligibilityEngine";
import { findMissingInformation } from "./missingInformationEngine";

const baseScheme: Scheme = {
  id: "missing-information-example",
  name: "Missing Information Example",
  category: "development-example",
  developmentOnly: true,
  source: { name: "Development example", url: "https://example.com/example", lastVerified: null },
  eligibility: {},
  benefit: { type: "placeholder", amount: null, description: "Development-only test data." },
  documents: [],
  conflictsWith: [],
  application: { mode: "placeholder", portalUrl: null, steps: [] },
};

const profile: CitizenProfile = {
  ...initialCitizenProfile,
  age: "22",
  state: "Maharashtra",
  occupation: "student",
  annualIncome: "",
};

function evaluate(scheme: Scheme, citizenProfile = profile) {
  const result = evaluateEligibility(citizenProfile, scheme);
  return findMissingInformation(scheme, citizenProfile, result);
}

export const missingInformationExamples = {
  missingIncome: evaluate({
    ...baseScheme,
    id: "missing-income-example",
    eligibility: { income_criteria: true },
  }),
  missingAcademicMerit: evaluate({
    ...baseScheme,
    id: "missing-academic-merit-example",
    eligibility: { academic_merit_required: true },
  }),
  missingResidenceType: evaluate({
    ...baseScheme,
    id: "missing-residence-example",
    eligibility: { rural_resident: true },
  }),
  missingLandholderStatus: evaluate({
    ...baseScheme,
    id: "missing-landholder-example",
    eligibility: { landholder: true },
  }),
  multipleMissingFields: evaluate({
    ...baseScheme,
    id: "multiple-missing-example",
    eligibility: { income_criteria: true, academic_merit_required: true, rural_resident: true },
  }),
  noMissingInformation: evaluate({
    ...baseScheme,
    id: "no-missing-example",
    eligibility: { occupation: ["student"], state: "Maharashtra" },
  }),
};

export function runMissingInformationExamples() {
  const expected: Array<[keyof typeof missingInformationExamples, string[]]> = [
    ["missingIncome", ["annualIncome"]],
    ["missingAcademicMerit", ["academicMerit"]],
    ["missingResidenceType", ["residenceType"]],
    ["missingLandholderStatus", ["landholderStatus"]],
    ["multipleMissingFields", ["annualIncome", "academicMerit", "residenceType"]],
    ["noMissingInformation", []],
  ];

  expected.forEach(([name, fields]) => {
    const actual = missingInformationExamples[name].missingInformation.map((item) => item.field);
    if (actual.join(",") !== fields.join(",")) {
      throw new Error(`${name} expected ${fields.join(", ")}, received ${actual.join(", ")}`);
    }
  });

  return missingInformationExamples;
}
