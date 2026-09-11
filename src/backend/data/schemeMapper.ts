import type { Scheme, SchemeBenefit, SchemeEligibility } from "@/types/scheme-types";

export type RawSchemeSeed = {
  id: string;
  name: string;
  level: string;
  state: string;
  category: string;
  target_groups: string[];
  eligibility: Record<string, unknown>;
  benefit: SchemeBenefit;
  documents: string[];
  conflicts: string[];
  conflictsWith?: string[];
  source_url: string;
  data_status: string;
  verification_note: string;
  application_url?: string | null;
};

export type RawSchemeSeedFile = {
  dataset_name: string;
  version: string;
  scheme_count: number;
  schemes: RawSchemeSeed[];
};

export function mapSchemeSeed(rawScheme: RawSchemeSeed): Scheme {
  const conflictReferences = rawScheme.conflicts ?? rawScheme.conflictsWith ?? [];
  return {
    id: rawScheme.id,
    name: rawScheme.name,
    level: rawScheme.level,
    state: rawScheme.state,
    category: rawScheme.category,
    target_groups: rawScheme.target_groups,
    source: {
      name: "Provided source URL",
      url: rawScheme.source_url,
      lastVerified: null,
    },
    data_status: rawScheme.data_status,
    verification_note: rawScheme.verification_note,
    eligibility: rawScheme.eligibility as SchemeEligibility,
    benefit: rawScheme.benefit,
    documents: rawScheme.documents,
    conflictsWith: conflictReferences,
    application: {
      mode: rawScheme.application_url ? "online" : "source-only",
      portalUrl: rawScheme.application_url ?? null,
      steps: [],
    },
    developmentOnly: false,
  };
}

export function mapSchemeSeeds(rawSchemes: RawSchemeSeed[]): Scheme[] {
  return rawSchemes.map(mapSchemeSeed);
}
