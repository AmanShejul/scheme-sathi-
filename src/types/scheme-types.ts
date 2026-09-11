export type SchemeEligibility = {
  [rule: string]: unknown;
  minAge?: number | null;
  maxAge?: number | null;
  maxIncome?: number | null;
  states?: string[];
  occupations?: string[];
  categories?: string[];
  student?: boolean | null;
  disability?: boolean | null;
};

export type SchemeBenefit = {
  [field: string]: unknown;
  type: string;
  amount?: string | number | null;
  description: string;
};

export type SchemeApplication = {
  mode: string;
  portalUrl?: string | null;
  steps: string[];
};

export type SchemeSource = {
  name: string;
  url: string;
  lastVerified: string | null;
};

export type Scheme = {
  id: string;
  name: string;
  /** Government/program level. This is distinct from geographic applicability in state. */
  level?: string;
  /** Geographic applicability or jurisdiction represented by the dataset, not the program level. */
  state?: string;
  category: string;
  target_groups?: string[];
  source: SchemeSource;
  data_status?: string;
  verification_note?: string;
  eligibility: SchemeEligibility;
  benefit: SchemeBenefit;
  documents: string[];
  conflictsWith: string[];
  application: SchemeApplication;
  developmentOnly: boolean;
};
