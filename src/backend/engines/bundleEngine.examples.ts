import type { Bundle, ConflictResult } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

import { generateBundles } from "./bundleEngine";

const baseScheme: Scheme = {
  id: "bundle-example-base",
  name: "Bundle Example Base",
  category: "development-example",
  developmentOnly: true,
  source: { name: "Development example", url: "https://example.com/example", lastVerified: null },
  eligibility: {},
  benefit: { type: "placeholder", amount: null, description: "Development-only test data." },
  documents: [],
  conflictsWith: [],
  application: { mode: "placeholder", portalUrl: null, steps: [] },
};

const scheme = (id: string): Scheme => ({ ...baseScheme, id, name: id });

const conflict = (schemeAId: string, schemeBId: string): ConflictResult => ({
  schemeA: schemeAId,
  schemeB: schemeBId,
  schemeAId,
  schemeBId,
  reason: "The scheme data explicitly marks these schemes as conflicting.",
});

const bundleIds = (bundles: Bundle[]) => bundles.map((bundle) => bundle.schemeIds.join("+"));

export const bundleEngineExamples = {
  noSchemes: generateBundles([], []),
  oneScheme: generateBundles([scheme("scheme-a")], []),
  twoCompatibleSchemes: generateBundles([scheme("scheme-a"), scheme("scheme-b")], []),
  twoConflictingSchemes: generateBundles(
    [scheme("scheme-a"), scheme("scheme-b")],
    [conflict("scheme-a", "scheme-b")],
  ),
  threeSchemesWithOneConflict: generateBundles(
    [scheme("scheme-a"), scheme("scheme-b"), scheme("scheme-c")],
    [conflict("scheme-a", "scheme-b")],
  ),
  duplicateOrdering: generateBundles([scheme("scheme-b"), scheme("scheme-a")], []),
  allConflicting: generateBundles(
    [scheme("scheme-a"), scheme("scheme-b"), scheme("scheme-c")],
    [conflict("scheme-a", "scheme-b"), conflict("scheme-a", "scheme-c"), conflict("scheme-b", "scheme-c")],
  ),
  multipleIndependentConflicts: generateBundles(
    [scheme("scheme-a"), scheme("scheme-b"), scheme("scheme-c"), scheme("scheme-d")],
    [conflict("scheme-a", "scheme-b"), conflict("scheme-c", "scheme-d")],
  ),
};

export function runBundleEngineExamples() {
  const expected: Array<[keyof typeof bundleEngineExamples, string[]]> = [
    ["noSchemes", []],
    ["oneScheme", ["scheme-a"]],
    ["twoCompatibleSchemes", ["scheme-a", "scheme-a+scheme-b", "scheme-b"]],
    ["twoConflictingSchemes", ["scheme-a", "scheme-b"]],
    ["threeSchemesWithOneConflict", ["scheme-a", "scheme-a+scheme-c", "scheme-b", "scheme-b+scheme-c", "scheme-c"]],
    ["duplicateOrdering", ["scheme-a", "scheme-a+scheme-b", "scheme-b"]],
    ["allConflicting", ["scheme-a", "scheme-b", "scheme-c"]],
    [
      "multipleIndependentConflicts",
      [
        "scheme-a",
        "scheme-a+scheme-c",
        "scheme-a+scheme-d",
        "scheme-b",
        "scheme-b+scheme-c",
        "scheme-b+scheme-d",
        "scheme-c",
        "scheme-d",
      ],
    ],
  ];

  expected.forEach(([name, expectedBundleIds]) => {
    const actualBundleIds = bundleIds(bundleEngineExamples[name]);
    if (actualBundleIds.join(",") !== expectedBundleIds.join(",")) {
      throw new Error(`${name} expected ${expectedBundleIds.join(", ")}, received ${actualBundleIds.join(", ")}`);
    }
  });

  const uniqueBundleIds = new Set(bundleIds(bundleEngineExamples.duplicateOrdering));
  if (uniqueBundleIds.size !== bundleEngineExamples.duplicateOrdering.length) {
    throw new Error("duplicateOrdering produced duplicate bundles.");
  }

  return bundleEngineExamples;
}
