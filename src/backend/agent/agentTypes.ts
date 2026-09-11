import type {
  AnalysisResult,
  ApplicationStep,
  Bundle,
  ConflictResult,
  EligibilityResult,
  MissingDocument,
} from "@/types/analysis-types";
import type { CitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

import type { MissingInformationResult } from "../engines/missingInformationEngine";
import type { BundleSearch } from "../engines/bundleEngine";

export type AgentToolStatus = "started" | "completed" | "failed";

export type AgentExecutionStep = {
  toolName: string;
  status: AgentToolStatus;
};

export type AgentGoal = {
  type: "scheme_bundle_optimization";
  description: string;
};

export type AgentContext = {
  citizenProfile: CitizenProfile;
  availableDocuments: string[];
  schemes: Scheme[];
};

export type AgentResult = {
  analysisResult: AnalysisResult;
  executionTrace: AgentExecutionStep[];
  goal: AgentGoal;
};

export type EvaluateEligibilityInput = {
  citizenProfile: CitizenProfile;
  schemes: Scheme[];
};

export type MissingInformationInput = {
  citizenProfile: CitizenProfile;
  scheme: Scheme;
  eligibilityResult: EligibilityResult;
};

export type DetectConflictsInput = {
  schemes: Scheme[];
};

export type GenerateBundlesInput = {
  schemes: Scheme[];
  conflicts: ConflictResult[];
};

export type OptimizeBundleInput = {
  citizenProfile: CitizenProfile;
  candidates: Bundle[] | BundleSearch;
  eligibilityResults: EligibilityResult[];
  missingInformation: MissingInformationResult[];
};

export type CheckDocumentsInput = {
  bundle: Bundle;
  schemes: Scheme[];
  availableDocuments: string[];
};

export type GenerateChecklistInput = {
  bundle: Bundle;
  schemes: Scheme[];
  missingDocuments: MissingDocument[];
};

export type AgentTool<Input, Output> = {
  name: string;
  description: string;
  execute: (input: Input) => Output;
};

export type AgentToolRegistry = {
  evaluateEligibility: AgentTool<EvaluateEligibilityInput, EligibilityResult[]>;
  getMissingInformation: AgentTool<MissingInformationInput, MissingInformationResult>;
  detectConflicts: AgentTool<DetectConflictsInput, ConflictResult[]>;
  generateBundles: AgentTool<GenerateBundlesInput, BundleSearch | Bundle[]>;
  optimizeBundle: AgentTool<OptimizeBundleInput, Bundle | null>;
  checkDocuments: AgentTool<CheckDocumentsInput, MissingDocument[]>;
  generateChecklist: AgentTool<GenerateChecklistInput, ApplicationStep[]>;
};
