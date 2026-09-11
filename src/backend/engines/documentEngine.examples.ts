import type { Bundle, MissingDocument } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

import { findMissingDocuments } from "./documentEngine";

const baseScheme: Scheme = {
  id: "document-example-base",
  name: "Document Example Base",
  category: "development-example",
  developmentOnly: true,
  source: { name: "Development example", url: "https://example.com/example", lastVerified: null },
  eligibility: {},
  benefit: { type: "placeholder", amount: null, description: "Development-only test data." },
  documents: [],
  conflictsWith: [],
  application: { mode: "placeholder", portalUrl: null, steps: [] },
};

const scheme = (id: string, documents: string[]): Scheme => ({ ...baseScheme, id, name: id, documents });

const documentStatuses = (items: MissingDocument[]) => items.map(({ document, status, requiredFor }) => ({ document, status, requiredFor }));

export const documentEngineExamples = {
  allDocumentsAvailable: findMissingDocuments(
    [scheme("scheme-a", ["Aadhaar", "Income Certificate"])],
    ["aadhaar", " income   certificate "],
  ),
  missingDocuments: findMissingDocuments([scheme("scheme-a", ["Aadhaar", "Income Certificate"])], ["Aadhaar"]),
  sharedDocument: findMissingDocuments(
    [scheme("scheme-a", ["Aadhaar", "Income Certificate"]), scheme("scheme-b", ["AADHAAR", "Caste Certificate"])],
    [],
  ),
  caseNormalization: findMissingDocuments([scheme("scheme-a", ["  AADHAAR  "])], ["aAdHaAr"]),
  duplicateDocuments: findMissingDocuments(
    [scheme("scheme-a", ["Aadhaar", " aadhaar ", "Aadhaar"])],
    [],
  ),
  noSelectedSchemes: findMissingDocuments([], ["Aadhaar"]),
  noRequiredDocuments: findMissingDocuments([scheme("scheme-a", [])], ["Aadhaar"]),
  emptyCitizenDocuments: findMissingDocuments([scheme("scheme-a", ["Aadhaar"])], []),
  mixedAvailableAndMissing: findMissingDocuments(
    [scheme("scheme-a", ["Aadhaar", "Income Certificate", "Caste Certificate"])],
    ["Aadhaar", "caste certificate"],
  ),
};

const bundle: Bundle = {
  name: "Recommended bundle",
  schemeIds: ["scheme-b", "scheme-a"],
  score: 0,
  reasons: [],
  excludedSchemes: [],
};

export const bundleSelectionExample = findMissingDocuments(
  bundle,
  [scheme("scheme-a", ["Aadhaar"]), scheme("scheme-b", ["Income Certificate"])],
  ["Aadhaar"],
);

export function runDocumentEngineExamples() {
  const expected: Array<[keyof typeof documentEngineExamples, Array<{ document: string; status: MissingDocument["status"] }>]>
    = [
      ["allDocumentsAvailable", [{ document: "Aadhaar", status: "available" }, { document: "Income Certificate", status: "available" }]],
      ["missingDocuments", [{ document: "Aadhaar", status: "available" }, { document: "Income Certificate", status: "missing" }]],
      ["sharedDocument", [
        { document: "Aadhaar", status: "missing" },
        { document: "Caste Certificate", status: "missing" },
        { document: "Income Certificate", status: "missing" },
      ]],
      ["caseNormalization", [{ document: "AADHAAR", status: "available" }]],
      ["duplicateDocuments", [{ document: "Aadhaar", status: "missing" }]],
      ["noSelectedSchemes", []],
      ["noRequiredDocuments", []],
      ["emptyCitizenDocuments", [{ document: "Aadhaar", status: "missing" }]],
      ["mixedAvailableAndMissing", [
        { document: "Aadhaar", status: "available" },
        { document: "Caste Certificate", status: "available" },
        { document: "Income Certificate", status: "missing" },
      ]],
    ];

  expected.forEach(([name, expectedItems]) => {
    const actualItems = documentStatuses(documentEngineExamples[name]);
    if (JSON.stringify(actualItems) !== JSON.stringify(expectedItems.map((item) => ({ ...item, requiredFor: actualItems.find((actual) => actual.document === item.document)?.requiredFor ?? [] })))) {
      throw new Error(`${name} produced unexpected document readiness.`);
    }
  });

  const sharedAadhaar = documentEngineExamples.sharedDocument.find((item) => item.document === "Aadhaar");
  if (!sharedAadhaar || sharedAadhaar.requiredFor.join(",") !== "scheme-a,scheme-b") {
    throw new Error("sharedDocument did not preserve both requiring schemes.");
  }

  if (bundleSelectionExample.length !== 2 || bundleSelectionExample[0].document !== "Aadhaar") {
    throw new Error("bundleSelectionExample did not use only selected bundle schemes.");
  }

  return documentEngineExamples;
}
