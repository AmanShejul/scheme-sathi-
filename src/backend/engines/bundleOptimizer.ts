import type { CitizenProfile } from "@/types/citizen-profile";
import type { Bundle, EligibilityResult } from "@/types/analysis-types";

import type { MissingInformationResult } from "./missingInformationEngine";

const MAX_MATCHED_RULES_FOR_SCORE = 5;
const MAX_SCORE = 100;

type BundleMetrics = {
  score: number;
  strongMatches: number;
  missingInformationCount: number;
};

function profileContextScore(profile: CitizenProfile): number {
  const scalarFields = [
    profile.age,
    profile.gender,
    profile.state,
    profile.city,
    profile.annualIncome,
    profile.occupation,
    profile.category,
    profile.studentStatus,
    profile.disabilityStatus,
    profile.familySize,
  ];
  const hasScalarContext = scalarFields.some((value) => value.trim() !== "");
  const hasBenefits = profile.existingBenefits.length > 0;
  const hasDocumentContext = Object.values(profile.documents).some((value) => value !== "");
  return hasScalarContext || hasBenefits || hasDocumentContext ? 5 : 0;
}

function statusScore(result: EligibilityResult | undefined): number {
  if (result?.status === "potentially_eligible") return 35;
  if (result?.status === "insufficient_data") return 15;
  return 0;
}

function matchedRulesScore(result: EligibilityResult | undefined): number {
  return Math.min(result?.matchedRules.length ?? 0, MAX_MATCHED_RULES_FOR_SCORE) * 5;
}

function completenessScore(result: EligibilityResult | undefined, missingCount: number): number {
  const matchedCount = result?.matchedRules.length ?? 0;
  const failedCount = result?.failedRules.length ?? 0;
  const knownAndResolved = matchedCount + failedCount;
  const totalConditions = knownAndResolved + missingCount;
  if (totalConditions === 0) return result?.status === "potentially_eligible" ? 25 : 0;
  return Math.round((knownAndResolved / totalConditions) * 25);
}

function uncertaintyScore(result: EligibilityResult | undefined): number {
  const failedCount = result?.failedRules.length ?? 0;
  return Math.max(0, 10 - failedCount * 5);
}

function scoreScheme(
  profile: CitizenProfile,
  result: EligibilityResult | undefined,
  missingCount: number,
): number {
  return Math.min(
    MAX_SCORE,
    statusScore(result) +
      matchedRulesScore(result) +
      completenessScore(result, missingCount) +
      uncertaintyScore(result) +
      profileContextScore(profile),
  );
}

function evaluateBundle(
  profile: CitizenProfile,
  bundle: Bundle,
  eligibilityByScheme: Map<string, EligibilityResult>,
  missingByScheme: Map<string, MissingInformationResult>,
): BundleMetrics {
  const schemeMetrics = bundle.schemeIds.map((schemeId) => {
    const result = eligibilityByScheme.get(schemeId);
    const missingCount = missingByScheme.get(schemeId)?.missingInformation.length ?? 0;
    return {
      score: scoreScheme(profile, result, missingCount),
      strongMatches: result?.status === "potentially_eligible" ? result.matchedRules.length : 0,
      missingInformationCount: missingCount,
    };
  });

  const totalScore = schemeMetrics.reduce((sum, metric) => sum + metric.score, 0);
  return {
    score: schemeMetrics.length === 0 ? 0 : Math.round(totalScore / schemeMetrics.length),
    strongMatches: schemeMetrics.reduce((sum, metric) => sum + metric.strongMatches, 0),
    missingInformationCount: schemeMetrics.reduce((sum, metric) => sum + metric.missingInformationCount, 0),
  };
}

function compareSchemeIds(left: string[], right: string[]): number {
  const leftKey = [...left].sort().join("\u0000");
  const rightKey = [...right].sort().join("\u0000");
  return leftKey.localeCompare(rightKey);
}

function isBetterCandidate(
  candidate: Bundle,
  candidateMetrics: BundleMetrics,
  current: Bundle,
  currentMetrics: BundleMetrics,
): boolean {
  if (candidateMetrics.score !== currentMetrics.score) return candidateMetrics.score > currentMetrics.score;
  if (candidateMetrics.strongMatches !== currentMetrics.strongMatches) {
    return candidateMetrics.strongMatches > currentMetrics.strongMatches;
  }
  if (candidateMetrics.missingInformationCount !== currentMetrics.missingInformationCount) {
    return candidateMetrics.missingInformationCount < currentMetrics.missingInformationCount;
  }
  if (candidate.schemeIds.length !== current.schemeIds.length) {
    return candidate.schemeIds.length < current.schemeIds.length;
  }
  return compareSchemeIds(candidate.schemeIds, current.schemeIds) < 0;
}

function recommendationReasons(
  selected: Bundle,
  selectedMetrics: BundleMetrics,
  candidates: Bundle[],
  metricsByBundle: Map<Bundle, BundleMetrics>,
): string[] {
  const reasons = ["Highest-scoring candidate based on the current rules."];
  const maximumStrongMatches = Math.max(...candidates.map((candidate) => metricsByBundle.get(candidate)?.strongMatches ?? 0));
  const minimumMissingInformation = Math.min(...candidates.map((candidate) => metricsByBundle.get(candidate)?.missingInformationCount ?? 0));

  if (selectedMetrics.strongMatches === maximumStrongMatches && selectedMetrics.strongMatches > 0) {
    reasons.push("The selected schemes have the strongest profile matches among the candidates.");
  }
  if (selectedMetrics.missingInformationCount === minimumMissingInformation) {
    reasons.push("This bundle requires less additional information than or equal to the other candidates.");
  }
  if (selectedMetrics.missingInformationCount > 0) {
    reasons.push("This bundle still contains unresolved information that may require confirmation.");
  }
  reasons.push("The selected candidate was supplied as a valid bundle with no explicit conflict indicated.");
  if (selected.schemeIds.length === 1) {
    reasons.push("A single-scheme candidate was retained as a valid option.");
  }
  return reasons;
}

/**
 * Selects one supplied candidate using deterministic, explainable scoring.
 * Candidate compatibility is established by the bundle generator; this
 * function never creates, expands, or rewrites a candidate bundle.
 */
export function optimizeBundle(
  profile: CitizenProfile,
  candidates: Bundle[],
  eligibilityResults: EligibilityResult[],
  missingInformation: MissingInformationResult[],
): Bundle | null {
  if (candidates.length === 0) return null;

  const eligibilityByScheme = new Map(eligibilityResults.map((result) => [result.schemeId, result]));
  const missingByScheme = new Map(missingInformation.map((result) => [result.schemeId, result]));
  const metricsByBundle = new Map<Bundle, BundleMetrics>();

  candidates.forEach((candidate) => {
    metricsByBundle.set(candidate, evaluateBundle(profile, candidate, eligibilityByScheme, missingByScheme));
  });

  let selected = candidates[0];
  let selectedMetrics = metricsByBundle.get(selected) ?? { score: 0, strongMatches: 0, missingInformationCount: 0 };

  candidates.slice(1).forEach((candidate) => {
    const candidateMetrics = metricsByBundle.get(candidate) ?? { score: 0, strongMatches: 0, missingInformationCount: 0 };
    if (isBetterCandidate(candidate, candidateMetrics, selected, selectedMetrics)) {
      selected = candidate;
      selectedMetrics = candidateMetrics;
    }
  });

  return {
    ...selected,
    name: "Recommended bundle",
    score: selectedMetrics.score,
    reasons: recommendationReasons(selected, selectedMetrics, candidates, metricsByBundle),
    excludedSchemes: [...selected.excludedSchemes],
  };
}
