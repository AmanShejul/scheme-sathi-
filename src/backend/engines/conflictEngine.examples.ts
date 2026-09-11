import type { Scheme } from "@/types/scheme-types";

import { detectConflicts } from "./conflictEngine";

const baseScheme: Scheme = {
  id: "conflict-example-base",
  name: "Conflict Example Base",
  category: "development-example",
  developmentOnly: true,
  source: { name: "Development example", url: "https://example.com/example", lastVerified: null },
  eligibility: {},
  benefit: { type: "placeholder", amount: null, description: "Development-only test data." },
  documents: [],
  conflictsWith: [],
  application: { mode: "placeholder", portalUrl: null, steps: [] },
};

const scheme = (id: string, conflictsWith: string[] = []): Scheme => ({
  ...baseScheme,
  id,
  name: id,
  conflictsWith,
});

const pairIds = (items: ReturnType<typeof detectConflicts>) =>
  items.map(({ schemeAId, schemeBId }) => `${schemeAId}+${schemeBId}`);

export const conflictEngineExamples = {
  oneExplicitConflict: detectConflicts([
    scheme("scheme-a", ["scheme-b"]),
    scheme("scheme-b"),
  ]),
  reverseDirectionDuplicate: detectConflicts([
    scheme("scheme-a", ["scheme-b"]),
    scheme("scheme-b", ["scheme-a"]),
  ]),
  multipleConflicts: detectConflicts([
    scheme("scheme-a", ["scheme-b", "scheme-c"]),
    scheme("scheme-b"),
    scheme("scheme-c"),
  ]),
  selfConflictIgnored: detectConflicts([scheme("scheme-a", ["scheme-a"])]),
  emptyConflicts: detectConflicts([scheme("scheme-a", []), scheme("scheme-b", [])]),
  missingConflictMetadata: detectConflicts([scheme("scheme-a"), scheme("scheme-b")]),
  noConflictData: detectConflicts([scheme("scheme-a"), scheme("scheme-b")]),
};

export function runConflictEngineExamples() {
  const expected: Array<[keyof typeof conflictEngineExamples, string[]]> = [
    ["oneExplicitConflict", ["scheme-a+scheme-b"]],
    ["reverseDirectionDuplicate", ["scheme-a+scheme-b"]],
    ["multipleConflicts", ["scheme-a+scheme-b", "scheme-a+scheme-c"]],
    ["selfConflictIgnored", []],
    ["emptyConflicts", []],
    ["missingConflictMetadata", []],
    ["noConflictData", []],
  ];

  expected.forEach(([name, expectedPairs]) => {
    const actualPairs = pairIds(conflictEngineExamples[name]);
    if (actualPairs.join(",") !== expectedPairs.join(",")) {
      throw new Error(`${name} expected ${expectedPairs.join(", ")}, received ${actualPairs.join(", ")}`);
    }
  });

  return conflictEngineExamples;
}
