import { generateApplicationPlan } from "../engines/applicationPlanEngine";
import { generateBundles as generateBundleCandidates } from "../engines/bundleEngine";
import { optimizeBundle as selectBundle } from "../engines/bundleOptimizer";
import { detectConflicts as findConflicts } from "../engines/conflictEngine";
import { findMissingDocuments } from "../engines/documentEngine";
import { evaluateEligibility as evaluateSchemeEligibility } from "../engines/eligibilityEngine";
import { findMissingInformation } from "../engines/missingInformationEngine";
import type {
  AgentToolRegistry,
  CheckDocumentsInput,
  DetectConflictsInput,
  EvaluateEligibilityInput,
  GenerateBundlesInput,
  GenerateChecklistInput,
  MissingInformationInput,
  OptimizeBundleInput,
} from "./agentTypes";

export function createAgentToolRegistry(): AgentToolRegistry {
  return {
    evaluateEligibility: {
      name: "evaluateEligibility",
      description: "Evaluate every supplied scheme using the deterministic eligibility engine.",
      execute: ({ citizenProfile, schemes }: EvaluateEligibilityInput) =>
        [...schemes]
          .sort((left, right) => left.id.localeCompare(right.id))
          .map((scheme) => evaluateSchemeEligibility(citizenProfile, scheme)),
    },
    getMissingInformation: {
      name: "getMissingInformation",
      description: "Find unresolved information for one insufficient-data scheme.",
      execute: ({ citizenProfile, scheme, eligibilityResult }: MissingInformationInput) =>
        findMissingInformation(scheme, citizenProfile, eligibilityResult),
    },
    detectConflicts: {
      name: "detectConflicts",
      description: "Detect only explicit conflicts among candidate schemes.",
      execute: ({ schemes }: DetectConflictsInput) => findConflicts([...schemes].sort((left, right) => left.id.localeCompare(right.id))),
    },
    generateBundles: {
      name: "generateBundles",
      description: "Generate deterministic conflict-free bundle candidates.",
      execute: ({ schemes, conflicts }: GenerateBundlesInput) => generateBundleCandidates(schemes, conflicts),
    },
    optimizeBundle: {
      name: "optimizeBundle",
      description: "Select the strongest supplied bundle candidate using deterministic scoring.",
      execute: ({ citizenProfile, candidates, eligibilityResults, missingInformation }: OptimizeBundleInput) =>
        selectBundle(citizenProfile, candidates, eligibilityResults, missingInformation),
    },
    checkDocuments: {
      name: "checkDocuments",
      description: "Evaluate document readiness for the selected bundle schemes.",
      execute: ({ bundle, schemes, availableDocuments }: CheckDocumentsInput) =>
        findMissingDocuments(bundle, schemes, availableDocuments),
    },
    generateChecklist: {
      name: "generateChecklist",
      description: "Generate the deterministic application plan for the selected bundle.",
      execute: ({ bundle, schemes, missingDocuments }: GenerateChecklistInput) =>
        generateApplicationPlan(bundle, schemes, missingDocuments),
    },
  };
}
