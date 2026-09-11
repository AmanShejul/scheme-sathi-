import { getAllSchemes, schemeRepositoryInitialization, schemeValidation } from "./schemeRepository";
import { mapSchemeSeed, type RawSchemeSeed } from "./schemeMapper";

export const schemeRepositoryExamples = {
  recordCount: getAllSchemes().length,
  stateSchemes: getAllSchemes().filter((scheme) => scheme.level === "State").length,
  centralSchemes: getAllSchemes().filter((scheme) => scheme.level === "Central").length,
  explicitConflicts: getAllSchemes().flatMap((scheme) => scheme.conflicts ?? []),
  validation: schemeValidation,
  initialization: schemeRepositoryInitialization,
};

export function runSchemeRepositoryExamples() {
  if (schemeRepositoryExamples.recordCount !== 50) throw new Error("The curated scheme dataset must contain 50 records.");
  if (schemeRepositoryExamples.stateSchemes !== 23) throw new Error("Unexpected Maharashtra state-scheme count.");
  if (schemeRepositoryExamples.centralSchemes !== 27) throw new Error("Unexpected central-scheme count.");
  if (schemeRepositoryExamples.explicitConflicts.length !== 0) throw new Error("The curated dataset unexpectedly contains conflict metadata.");
  if (!schemeRepositoryExamples.validation.valid) throw new Error("The curated scheme dataset failed structural validation.");

  const rawWithPortal: RawSchemeSeed = {
    id: "example-portal",
    name: "Example Portal Scheme",
    level: "Central",
    state: "All India",
    category: "Example",
    target_groups: [],
    eligibility: {},
    benefit: { type: "example", description: "Example only." },
    documents: [],
    conflicts: [],
    source_url: "https://example.gov.in/source",
    application_url: "https://example.gov.in/apply",
    data_status: "example",
    verification_note: "Example only.",
  };
  const mapped = mapSchemeSeed(rawWithPortal);
  if (mapped.application.portalUrl !== rawWithPortal.application_url) throw new Error("Explicit application URL was not preserved.");

  return schemeRepositoryExamples;
}
