export type SchemeEligibility = {
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
  category: string;
  source: SchemeSource;
  eligibility: SchemeEligibility;
  benefit: SchemeBenefit;
  documents: string[];
  conflictsWith: string[];
  application: SchemeApplication;
  developmentOnly: boolean;
};
