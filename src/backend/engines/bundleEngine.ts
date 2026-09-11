import type { Bundle, ConflictResult } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

const BUNDLE_REASON = "All schemes in this bundle have no explicit conflict in the current scheme metadata.";

function pairKey(schemeAId: string, schemeBId: string): string {
  return [schemeAId, schemeBId].sort().join("\u0000");
}

function conflictKeys(conflicts: ConflictResult[]): Set<string> {
  return new Set(conflicts.map((conflict) => pairKey(conflict.schemeAId, conflict.schemeBId)));
}

function isCompatible(schemeId: string, selectedIds: string[], conflicts: Set<string>): boolean {
  return selectedIds.every((selectedId) => !conflicts.has(pairKey(schemeId, selectedId)));
}

function createBundle(schemeIds: string[]): Bundle {
  const sortedSchemeIds = [...schemeIds].sort();
  return {
    name: `Candidate Bundle: ${sortedSchemeIds.join(" + ")}`,
    schemeIds: sortedSchemeIds,
    score: 0,
    reasons: [BUNDLE_REASON],
    excludedSchemes: [],
  };
}

/**
 * Generates every non-empty, conflict-free combination of the supplied schemes.
 * Eligibility must already have been evaluated by the caller.
 */
export function generateBundles(schemes: Scheme[], conflicts: ConflictResult[]): Bundle[] {
  const uniqueSchemes = new Map(schemes.map((scheme) => [scheme.id, scheme]));
  const schemeIds = [...uniqueSchemes.keys()].sort();
  if (schemeIds.length === 0) return [];

  const explicitConflictKeys = conflictKeys(conflicts);
  const bundles: Bundle[] = [];

  function collectCombinations(startIndex: number, selectedIds: string[]) {
    for (let index = startIndex; index < schemeIds.length; index += 1) {
      const schemeId = schemeIds[index];
      if (!isCompatible(schemeId, selectedIds, explicitConflictKeys)) continue;

      const nextSelection = [...selectedIds, schemeId];
      bundles.push(createBundle(nextSelection));
      collectCombinations(index + 1, nextSelection);
    }
  }

  collectCombinations(0, []);
  return bundles;
}
