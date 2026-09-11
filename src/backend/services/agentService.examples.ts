import { initialCitizenProfile, type CitizenProfile } from "@/types/citizen-profile";
import type { EligibilityResult } from "@/types/analysis-types";

import { createAgentToolRegistry } from "../agent/agentTools";
import type { AgentContext, AgentExecutionStep, AgentToolRegistry } from "../agent/agentTypes";
import { getAllSchemes } from "../data/schemeRepository";
import { AgentToolExecutionError, runAgent } from "./agentService";

const studentOBC: CitizenProfile = {
  ...initialCitizenProfile,
  age: "22",
  state: "Maharashtra",
  occupation: "student",
  category: "OBC",
  studentStatus: "Yes",
  disabilityStatus: "No",
  annualIncome: "Rs. 1 lakh - Rs. 3 lakh",
};

const farmer: CitizenProfile = { ...initialCitizenProfile, age: "40", state: "Maharashtra", occupation: "farmer" };
const incomplete: CitizenProfile = { ...initialCitizenProfile };
const schemes = getAllSchemes();
const context = (citizenProfile: CitizenProfile, availableDocuments: string[]): AgentContext => ({ citizenProfile, availableDocuments, schemes });

function completedTools(trace: AgentExecutionStep[]): string[] {
  return trace.filter((step) => step.status === "completed").map((step) => step.toolName);
}

function allNotEligibleRegistry(): AgentToolRegistry {
  const registry = createAgentToolRegistry();
  registry.evaluateEligibility = {
    ...registry.evaluateEligibility,
    execute: ({ schemes: candidates }): EligibilityResult[] => candidates.map((scheme) => ({
      schemeId: scheme.id,
      status: "not_eligible",
      reasons: ["Example-only deterministic stub."],
      matchedRules: [],
      failedRules: ["example"],
    })),
  };
  return registry;
}

function noBundleRegistry(): AgentToolRegistry {
  const registry = createAgentToolRegistry();
  registry.generateBundles = { ...registry.generateBundles, execute: () => [] };
  return registry;
}

function failingEligibilityRegistry(): AgentToolRegistry {
  const registry = createAgentToolRegistry();
  registry.evaluateEligibility = { ...registry.evaluateEligibility, execute: () => { throw new Error("example failure"); } };
  return registry;
}

export const agentServiceExamples = {
  studentOBC: runAgent(context(studentOBC, ["Aadhaar", "Income Certificate"])),
  farmer: runAgent(context(farmer, ["Aadhaar"])),
  incomplete: runAgent(context(incomplete, [])),
  noAvailableDocuments: runAgent(context(studentOBC, [])),
  noPotentiallyEligibleSchemes: runAgent(context(studentOBC, []), allNotEligibleRegistry()),
  noBundleAfterCompatibilityFiltering: runAgent(context(studentOBC, []), noBundleRegistry()),
  recommendedBundleExists: runAgent(context(farmer, ["Aadhaar"])),
  missingDocuments: runAgent(context(farmer, [])),
};

export function runAgentServiceExamples() {
  const successful = agentServiceExamples.recommendedBundleExists;
  const successfulTools = completedTools(successful.executionTrace);
  const eligibilityIndex = successfulTools.indexOf("evaluateEligibility");
  const conflictIndex = successfulTools.indexOf("detectConflicts");
  const bundleIndex = successfulTools.indexOf("generateBundles");
  const optimizeIndex = successfulTools.indexOf("optimizeBundle");
  const betweenEligibilityAndConflicts = successfulTools.slice(eligibilityIndex + 1, conflictIndex);
  if (
    eligibilityIndex !== 0 ||
    conflictIndex < 0 ||
    bundleIndex < conflictIndex ||
    optimizeIndex < bundleIndex ||
    betweenEligibilityAndConflicts.some((toolName) => toolName !== "getMissingInformation")
  ) {
    throw new Error("Successful agent trace did not follow the expected PS16 tool order.");
  }
  if (!successful.analysisResult.recommendedBundle || !successfulTools.includes("checkDocuments") || !successfulTools.includes("generateChecklist")) {
    throw new Error("Successful agent trace did not complete document and checklist reasoning.");
  }

  const incompleteResults = agentServiceExamples.incomplete.analysisResult.eligibilityResults;
  if (!incompleteResults.some((result) => result.status === "insufficient_data")) throw new Error("Incomplete profile lacked insufficient-data results.");
  if (agentServiceExamples.noAvailableDocuments.analysisResult.recommendedBundle === null) throw new Error("No-document scenario lost its recommendation.");

  const noPotentialTrace = completedTools(agentServiceExamples.noPotentiallyEligibleSchemes.executionTrace);
  if (agentServiceExamples.noPotentiallyEligibleSchemes.analysisResult.recommendedBundle !== null || noPotentialTrace.includes("detectConflicts")) {
    throw new Error("No-potential scenario did not stop before compatibility reasoning.");
  }

  const noBundle = agentServiceExamples.noBundleAfterCompatibilityFiltering;
  const noBundleTools = completedTools(noBundle.executionTrace);
  if (noBundle.analysisResult.recommendedBundle !== null || noBundleTools.includes("checkDocuments") || noBundleTools.includes("generateChecklist")) {
    throw new Error("No-bundle scenario did not stop before downstream tools.");
  }

  try {
    runAgent(context(farmer, []), failingEligibilityRegistry());
    throw new Error("Tool failure did not propagate.");
  } catch (error) {
    if (!(error instanceof AgentToolExecutionError) || error.toolName !== "evaluateEligibility") {
      throw new Error("Tool failure was not identified by tool name.");
    }
  }

  const first = runAgent(context(studentOBC, ["Aadhaar"]));
  const second = runAgent(context(studentOBC, ["Aadhaar"]));
  if (JSON.stringify(first) !== JSON.stringify(second)) throw new Error("Agent execution was not deterministic.");

  return agentServiceExamples;
}
