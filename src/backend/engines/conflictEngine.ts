import type { ConflictResult } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

const EXPLICIT_CONFLICT_REASON = "The scheme data explicitly marks these schemes as conflicting.";

function conflictIdsFor(scheme: Scheme): string[] {
  return [...(scheme.conflictsWith ?? []), ...(scheme.conflicts ?? [])];
}

/**
 * Finds explicitly declared conflicts among the supplied schemes.
 *
 * This function intentionally does not infer conflicts from any other scheme
 * field. A conflict is included only when its referenced scheme is also in
 * the supplied list.
 */
export function detectConflicts(schemes: Scheme[]): ConflictResult[] {
  const providedIds = new Set(schemes.map((scheme) => scheme.id));
  const seenPairs = new Set<string>();
  const conflicts: ConflictResult[] = [];

  schemes.forEach((scheme) => {
    conflictIdsFor(scheme).forEach((conflictId) => {
      if (!providedIds.has(conflictId) || conflictId === scheme.id) return;

      const [schemeAId, schemeBId] = [scheme.id, conflictId].sort();
      const pairKey = `${schemeAId}\u0000${schemeBId}`;
      if (seenPairs.has(pairKey)) return;

      seenPairs.add(pairKey);
      conflicts.push({
        schemeA: schemeAId,
        schemeB: schemeBId,
        schemeAId,
        schemeBId,
        reason: EXPLICIT_CONFLICT_REASON,
      });
    });
  });

  return conflicts;
}
