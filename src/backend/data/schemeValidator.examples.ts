import rawSchemeSeed from "../../../data/schemes.seed.json";

import { validateSchemeSeed, validateSchemes } from "./schemeValidator";

type ExampleRecord = Record<string, unknown>;

const baseRecord: ExampleRecord = {
  id: "VALID001",
  name: "Validator Example Scheme",
  level: "State",
  state: "Maharashtra",
  category: "Education",
  target_groups: ["student"],
  eligibility: { state: "Maharashtra", student: true },
  benefit: { type: "support", description: "Example support." },
  documents: ["Aadhaar"],
  conflicts: [],
  source_url: "https://example.gov.in/source",
  data_status: "example",
  verification_note: "Example validator record.",
};

function record(overrides: ExampleRecord = {}): ExampleRecord {
  return { ...baseRecord, ...overrides };
}

function expectInvalid(name: string, result: ReturnType<typeof validateSchemes>): void {
  if (result.valid) throw new Error(`${name} should have failed validation.`);
}

const validConflictRecords = [
  record({ id: "VALID001", conflicts: ["VALID002"], conflictsWith: ["VALID002"] }),
  record({ id: "VALID002", name: "Second Validator Scheme" }),
];

export const schemeValidatorExamples = {
  currentCanonicalDataset: validateSchemeSeed(rawSchemeSeed),
  missingLevel: validateSchemes([record({ level: undefined })]),
  invalidLevel: validateSchemes([record({ level: "National" })]),
  invalidState: validateSchemes([record({ state: "Gujarat" })]),
  duplicateId: validateSchemes([record(), record({ name: "Second Scheme" })]),
  duplicateName: validateSchemes([record(), record({ id: "VALID002" })]),
  malformedTargetGroups: validateSchemes([record({ target_groups: ["student", ""] })]),
  malformedBenefit: validateSchemes([record({ benefit: { type: "support" } })]),
  malformedEligibilityValue: validateSchemes([record({ eligibility: { state: { value: "Maharashtra" } } })]),
  invalidConflictReference: validateSchemes([record({ conflicts: ["UNKNOWN001"] })]),
  conflictsWithInvalidReference: validateSchemes([record({ conflictsWith: ["UNKNOWN001"] })]),
  matchingConflictAliases: validateSchemes(validConflictRecords),
};

export function runSchemeValidatorExamples() {
  if (!schemeValidatorExamples.currentCanonicalDataset.valid) {
    throw new Error("The current 50-scheme canonical dataset failed validation.");
  }

  [
    ["missingLevel", schemeValidatorExamples.missingLevel],
    ["invalidLevel", schemeValidatorExamples.invalidLevel],
    ["invalidState", schemeValidatorExamples.invalidState],
    ["duplicateId", schemeValidatorExamples.duplicateId],
    ["duplicateName", schemeValidatorExamples.duplicateName],
    ["malformedTargetGroups", schemeValidatorExamples.malformedTargetGroups],
    ["malformedBenefit", schemeValidatorExamples.malformedBenefit],
    ["malformedEligibilityValue", schemeValidatorExamples.malformedEligibilityValue],
    ["invalidConflictReference", schemeValidatorExamples.invalidConflictReference],
    ["conflictsWithInvalidReference", schemeValidatorExamples.conflictsWithInvalidReference],
  ].forEach(([name, result]) => expectInvalid(name as string, result as ReturnType<typeof validateSchemes>));

  if (!schemeValidatorExamples.duplicateId.duplicateIds.includes("VALID001")) {
    throw new Error("Duplicate scheme ID was not recorded.");
  }
  if (!schemeValidatorExamples.duplicateName.duplicateNames.includes("Validator Example Scheme")) {
    throw new Error("Duplicate scheme name was not recorded.");
  }
  if (!schemeValidatorExamples.matchingConflictAliases.valid) {
    throw new Error("Matching conflicts and conflictsWith fields should be valid.");
  }

  return schemeValidatorExamples;
}
