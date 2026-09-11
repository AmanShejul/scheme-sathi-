import type { ApplicationStep, Bundle, MissingDocument } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

import { generateApplicationPlan } from "./applicationPlanEngine";

const baseScheme: Scheme = {
  id: "application-example-base",
  name: "Application Example Base",
  category: "development-example",
  developmentOnly: true,
  source: { name: "Development example", url: "https://example.com/source", lastVerified: null },
  eligibility: {},
  benefit: { type: "placeholder", amount: null, description: "Development-only test data." },
  documents: [],
  conflictsWith: [],
  application: { mode: "placeholder", portalUrl: null, steps: [] },
};

const scheme = (
  id: string,
  documents: string[],
  portalUrl: string | null,
  sourceUrl = "https://example.com/source",
  steps: string[] = [],
): Scheme => ({
  ...baseScheme,
  id,
  name: `Scheme ${id}`,
  documents,
  source: { ...baseScheme.source, url: sourceUrl },
  application: { mode: "online", portalUrl, steps },
});

const readiness = (schemeId: string, document: string, status: MissingDocument["status"]): MissingDocument => ({
  document,
  requiredFor: [schemeId],
  status,
  name: document,
  schemeIds: status === "missing" ? [schemeId] : [],
});

const bundle: Bundle = {
  name: "Recommended bundle",
  schemeIds: ["scheme-b", "scheme-a"],
  score: 0,
  reasons: [],
  excludedSchemes: [],
};

export const applicationPlanExamples = {
  oneSchemeWithUrl: generateApplicationPlan([scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/apply")], []),
  oneSchemeWithoutUrl: generateApplicationPlan([scheme("scheme-a", ["Aadhaar"], null, "")], []),
  multipleSchemes: generateApplicationPlan(
    [scheme("scheme-b", ["Income Certificate"], "https://example.gov.in/b"), scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/a")],
    [],
  ),
  missingDocuments: generateApplicationPlan(
    [scheme("scheme-a", ["Aadhaar", "Income Certificate"], "https://example.gov.in/apply")],
    [readiness("scheme-a", "Income Certificate", "missing")],
  ),
  noSelectedSchemes: generateApplicationPlan([], []),
  mixedUrlAvailability: generateApplicationPlan(
    [scheme("scheme-b", ["Income Certificate"], null, ""), scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/a")],
    [],
  ),
  duplicateSchemeInput: generateApplicationPlan(
    [scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/a"), scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/a")],
    [],
  ),
  metadataApplicationSteps: generateApplicationPlan(
    [scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/a", "", ["Submit the completed form through the portal."])],
    [],
  ),
  bundleSelection: generateApplicationPlan(
    bundle,
    [scheme("scheme-a", ["Aadhaar"], "https://example.gov.in/a"), scheme("scheme-b", ["Income Certificate"], "https://example.gov.in/b"), scheme("scheme-c", ["Caste Certificate"], "https://example.gov.in/c")],
    [],
  ),
};

const summarize = (steps: ApplicationStep[]) => steps.map(({ stepNumber, schemeId, officialPortalUrl, documents }) => ({ stepNumber, schemeId, officialPortalUrl, documents }));

export function runApplicationPlanExamples() {
  const expected: Array<[keyof typeof applicationPlanExamples, number]> = [
    ["oneSchemeWithUrl", 1],
    ["oneSchemeWithoutUrl", 1],
    ["multipleSchemes", 2],
    ["missingDocuments", 1],
    ["noSelectedSchemes", 0],
    ["mixedUrlAvailability", 2],
    ["duplicateSchemeInput", 1],
    ["metadataApplicationSteps", 1],
    ["bundleSelection", 2],
  ];

  expected.forEach(([name, expectedCount]) => {
    const actual = applicationPlanExamples[name];
    if (actual.length !== expectedCount) throw new Error(`${name} expected ${expectedCount} steps, received ${actual.length}`);
    actual.forEach((step, index) => {
      if (step.stepNumber !== index + 1) throw new Error(`${name} has non-deterministic step numbering.`);
    });
  });

  if (applicationPlanExamples.oneSchemeWithUrl[0].officialPortalUrl !== "https://example.gov.in/apply") {
    throw new Error("oneSchemeWithUrl did not preserve a usable official URL.");
  }
  if (applicationPlanExamples.oneSchemeWithoutUrl[0].officialPortalUrl !== null) {
    throw new Error("oneSchemeWithoutUrl did not return null for the URL.");
  }
  if (applicationPlanExamples.multipleSchemes[0].schemeId !== "scheme-a") {
    throw new Error("multipleSchemes was not sorted by scheme ID.");
  }
  if (applicationPlanExamples.missingDocuments[0].documents.join(",") !== "Aadhaar,Income Certificate") {
    throw new Error("missingDocuments did not retain scheme document metadata.");
  }
  if (applicationPlanExamples.metadataApplicationSteps[0].action !== "Submit the completed form through the portal.") {
    throw new Error("metadataApplicationSteps did not use application metadata.");
  }

  summarize(applicationPlanExamples.bundleSelection);
  return applicationPlanExamples;
}
