import type { CitizenProfile } from "./citizen-profile";

export type AnalysisExplanation = {
  summary: string;
  whyRecommended: string[];
  missingInformationExplanation: string[];
  nextSteps: string[];
};

export type EligibilityStatus =
  | "potentially_eligible"
  | "not_eligible"
  | "insufficient_data";

export type EligibilityResult = {
  schemeId: string;
  status: EligibilityStatus;
  reasons: string[];
  matchedRules: string[];
  failedRules: string[];
};

export type ConflictResult = {
  schemeA: string;
  schemeB: string;
  reason: string;
  schemeAId: string;
  schemeBId: string;
};

export type Bundle = {
  name: string;
  schemeIds: string[];
  score: number;
  reasons: string[];
  excludedSchemes: string[];
  explanation?: string;
  excludedSchemeIds?: string[];
};

export type MissingDocument = {
  document: string;
  requiredFor: string[];
  status: "available" | "missing";
  name: string;
  schemeIds: string[];
};

export type ApplicationStep = {
  stepNumber: number;
  schemeId: string;
  schemeName: string;
  action: string;
  documents: string[];
  officialPortalUrl: string | null;
  requiredDocuments: string[];
  portalUrl?: string | null;
  completed?: boolean;
};

export type AnalyzeRequest = {
  citizenProfile: CitizenProfile;
  availableDocuments: string[];
};

export type AnalyzeResponse = {
  eligibilityResults: EligibilityResult[];
  conflicts: ConflictResult[];
  recommendedBundle: Bundle | null;
  missingDocuments: MissingDocument[];
  applicationPlan: ApplicationStep[];
  aiExplanation?: AnalysisExplanation | null;
};

export type AnalysisResult = AnalyzeResponse;
