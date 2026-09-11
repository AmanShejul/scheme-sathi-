import type { Bundle, ConflictResult } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

const BUNDLE_REASON = "All schemes in this bundle have no explicit conflict in the current scheme metadata.";

export type BundleSearch = {
  forEach: (callback: (bundle: Bundle) => void) => void;
};

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
export function createBundleSearch(schemes: Scheme[], conflicts: ConflictResult[]): BundleSearch {
  const uniqueSchemes = new Map(schemes.map((scheme) => [scheme.id, scheme]));
  const schemeIds = [...uniqueSchemes.keys()].sort();
  const explicitConflictKeys = conflictKeys(conflicts);

  return {
    forEach(callback) {
      function collectCombinations(startIndex: number, selectedIds: string[]) {
        for (let index = startIndex; index < schemeIds.length; index += 1) {
          const schemeId = schemeIds[index];
          if (!isCompatible(schemeId, selectedIds, explicitConflictKeys)) continue;

          const nextSelection = [...selectedIds, schemeId];
          callback(createBundle(nextSelection));
          collectCombinations(index + 1, nextSelection);
        }
      }

      collectCombinations(0, []);
    },
  };
}

/**
 * Preserves the original eager API for callers that explicitly need an array.
 * Production orchestration uses createBundleSearch to avoid materializing the
 * complete combination space.
 */
export function generateBundles(schemes: Scheme[], conflicts: ConflictResult[]): Bundle[] {
  const bundles: Bundle[] = [];
  createBundleSearch(schemes, conflicts).forEach((bundle) => bundles.push(bundle));
  return bundles;
}
