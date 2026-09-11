import type { AnalysisResult } from "@/types/analysis-types";

import {
  type AgentContext,
  type AgentExecutionStep,
  type AgentResult,
  type AgentTool,
  type AgentToolRegistry,
} from "../agent/agentTypes";
import { createAgentToolRegistry } from "../agent/agentTools";

const GOAL = {
  type: "scheme_bundle_optimization" as const,
  description: "Find the best compatible government-benefit plan for this citizen.",
};

export class AgentToolExecutionError extends Error {
  readonly toolName: string;

  constructor(toolName: string) {
    super(`Agent tool failed: ${toolName}.`);
    this.name = "AgentToolExecutionError";
    this.toolName = toolName;
  }
}

function runTool<Input, Output>(
  tool: AgentTool<Input, Output>,
  input: Input,
  executionTrace: AgentExecutionStep[],
): Output {
  executionTrace.push({ toolName: tool.name, status: "started" });
  try {
    const output = tool.execute(input);
    executionTrace.push({ toolName: tool.name, status: "completed" });
    return output;
  } catch {
    executionTrace.push({ toolName: tool.name, status: "failed" });
    throw new AgentToolExecutionError(tool.name);
  }
}

function emptyAnalysis(eligibilityResults: AnalysisResult["eligibilityResults"], conflicts: AnalysisResult["conflicts"]): AnalysisResult {
  return {
    eligibilityResults,
    conflicts,
    recommendedBundle: null,
    missingDocuments: [],
    applicationPlan: [],
  };
}

/** Runs the controlled, deterministic PS16 reasoning workflow. */
export function runAgent(context: AgentContext, tools: AgentToolRegistry = createAgentToolRegistry()): AgentResult {
  const schemes = [...context.schemes].sort((left, right) => left.id.localeCompare(right.id));
  const executionTrace: AgentExecutionStep[] = [];
  const eligibilityResults = runTool(
    tools.evaluateEligibility,
    { citizenProfile: context.citizenProfile, schemes },
    executionTrace,
  );

  const missingInformation = eligibilityResults
    .filter((result) => result.status === "insufficient_data")
    .map((eligibilityResult) => {
      const scheme = schemes.find((candidate) => candidate.id === eligibilityResult.schemeId);
      if (!scheme) throw new AgentToolExecutionError("getMissingInformation");
      return runTool(
        tools.getMissingInformation,
        { citizenProfile: context.citizenProfile, scheme, eligibilityResult },
        executionTrace,
      );
    });

  const potentiallyEligibleSchemes = schemes.filter((scheme) =>
    eligibilityResults.some((result) => result.schemeId === scheme.id && result.status === "potentially_eligible"),
  );
  if (potentiallyEligibleSchemes.length === 0) {
    return {
      analysisResult: emptyAnalysis(eligibilityResults, []),
      executionTrace,
      goal: GOAL,
    };
  }

  const conflicts = runTool(tools.detectConflicts, { schemes: potentiallyEligibleSchemes }, executionTrace);
  const candidates = runTool(tools.generateBundles, { schemes: potentiallyEligibleSchemes, conflicts }, executionTrace);
  const recommendedBundle = runTool(
    tools.optimizeBundle,
    { citizenProfile: context.citizenProfile, candidates, eligibilityResults, missingInformation },
    executionTrace,
  );
  if (!recommendedBundle) {
    return {
      analysisResult: emptyAnalysis(eligibilityResults, conflicts),
      executionTrace,
      goal: GOAL,
    };
  }

  const missingDocuments = runTool(
    tools.checkDocuments,
    { bundle: recommendedBundle, schemes: potentiallyEligibleSchemes, availableDocuments: context.availableDocuments },
    executionTrace,
  );
  const applicationPlan = runTool(
    tools.generateChecklist,
    { bundle: recommendedBundle, schemes: potentiallyEligibleSchemes, missingDocuments },
    executionTrace,
  );

  return {
    analysisResult: { eligibilityResults, conflicts, recommendedBundle, missingDocuments, applicationPlan },
    executionTrace,
    goal: GOAL,
  };
}

export const runAnalysisAgent = runAgent;
