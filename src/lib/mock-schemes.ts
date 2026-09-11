import rawSchemeSeed from "../../data/schemes.seed.json";
import type { Scheme } from "@/types/scheme-types";

export const mockSchemes: Scheme[] = rawSchemeSeed.schemes.map((scheme) => ({
  id: scheme.id,
  name: scheme.name,
  level: scheme.level,
  state: scheme.state,
  category: scheme.category,
  target_groups: scheme.target_groups,
  source: { name: "Provided source URL", url: scheme.source_url, lastVerified: null },
  source_url: scheme.source_url,
  data_status: scheme.data_status,
  verification_note: scheme.verification_note,
  eligibility: scheme.eligibility,
  benefit: scheme.benefit,
  documents: scheme.documents,
  conflictsWith: scheme.conflicts,
  conflicts: scheme.conflicts,
  application: { mode: "not-configured-in-seed", portalUrl: scheme.source_url, steps: [] },
  developmentOnly: true,
}));
export const primaryMockScheme = mockSchemes[0];
