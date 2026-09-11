import { initialCitizenProfile } from "@/types/citizen-profile";
import type { Bundle, EligibilityResult } from "@/types/analysis-types";

import type { MissingInformationResult } from "./missingInformationEngine";
import { optimizeBundle } from "./bundleOptimizer";

const profile = { ...initialCitizenProfile, age: "30", state: "Maharashtra", occupation: "farmer" };

const bundle = (schemeIds: string[]): Bundle => ({
  name: `Candidate ${schemeIds.join("+")}`,
  schemeIds,
  score: 0,
  reasons: [],
  excludedSchemes: [],
});

const eligibility = (
  schemeId: string,
  status: EligibilityResult["status"],
  matchedRules: string[] = [],
  failedRules: string[] = [],
): EligibilityResult => ({
  schemeId,
  status,
  matchedRules,
  failedRules,
  reasons: [],
});

const missing = (schemeId: string, count: number): MissingInformationResult => ({
  schemeId,
  missingInformation: Array.from({ length: count }, (_, index) => ({
    field: `field-${index}`,
    label: `Field ${index}`,
    reason: "Required for this example.",
  })),
});

const selectedIds = (result: Bundle | null) => result?.schemeIds.join("+") ?? null;

export const bundleOptimizerExamples = {
  noCandidates: optimizeBundle(profile, [], [], []),
  oneCandidate: optimizeBundle(profile, [bundle(["scheme-a"])], [eligibility("scheme-a", "potentially_eligible", ["state"])], []),
  differentScores: optimizeBundle(
    profile,
    [bundle(["scheme-a"]), bundle(["scheme-b"])],
    [eligibility("scheme-a", "potentially_eligible", ["state", "occupation"]), eligibility("scheme-b", "insufficient_data")],
    [],
  ),
  tieBreakStrongMatches: optimizeBundle(
    profile,
    [bundle(["scheme-a"]), bundle(["scheme-b"])],
    [
      eligibility("scheme-a", "potentially_eligible", ["state", "occupation", "category"]),
      eligibility("scheme-b", "potentially_eligible", ["state"]),
    ],
    [missing("scheme-a", 2)],
  ),
  fewerMissingInformation: optimizeBundle(
    profile,
    [bundle(["scheme-a"]), bundle(["scheme-b"])],
    [eligibility("scheme-a", "potentially_eligible", ["state"]), eligibility("scheme-b", "potentially_eligible", ["state"])],
    [missing("scheme-a", 2), missing("scheme-b", 0)],
  ),
  equalScoresBySchemeId: optimizeBundle(
    profile,
    [bundle(["scheme-b"]), bundle(["scheme-a"])],
    [eligibility("scheme-a", "potentially_eligible"), eligibility("scheme-b", "potentially_eligible")],
    [],
  ),
  unresolvedInformation: optimizeBundle(
    profile,
    [bundle(["scheme-a"])],
    [eligibility("scheme-a", "insufficient_data", ["state"])],
    [missing("scheme-a", 1)],
  ),
};

export function runBundleOptimizerExamples() {
  const expected: Array<[keyof typeof bundleOptimizerExamples, string | null]> = [
    ["noCandidates", null],
    ["oneCandidate", "scheme-a"],
    ["differentScores", "scheme-a"],
    ["tieBreakStrongMatches", "scheme-a"],
    ["fewerMissingInformation", "scheme-b"],
    ["equalScoresBySchemeId", "scheme-a"],
    ["unresolvedInformation", null],
  ];

  expected.forEach(([name, expectedIds]) => {
    const actualIds = selectedIds(bundleOptimizerExamples[name]);
    if (actualIds !== expectedIds) {
      throw new Error(`${name} expected ${expectedIds ?? "null"}, received ${actualIds ?? "null"}`);
    }
  });

  if (bundleOptimizerExamples.unresolvedInformation !== null) {
    throw new Error("unresolvedInformation was incorrectly selected as a recommendation.");
  }

  return bundleOptimizerExamples;
}
