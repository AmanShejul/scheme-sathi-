import type { Bundle, MissingDocument } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

function normalizeDocumentName(document: string): string {
  return document.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function selectedSchemesFromBundle(bundle: Bundle | null, schemes: Scheme[]): Scheme[] {
  if (!bundle) return [];
  const selectedIds = new Set(bundle.schemeIds);
  return schemes.filter((scheme) => selectedIds.has(scheme.id));
}

function createDocumentResult(
  document: string,
  requiredFor: string[],
  availableDocuments: Set<string>,
): MissingDocument {
  const isAvailable = availableDocuments.has(normalizeDocumentName(document));
  const sortedRequiredFor = [...new Set(requiredFor)].sort();
  return {
    document,
    requiredFor: sortedRequiredFor,
    status: isAvailable ? "available" : "missing",
    name: document,
    schemeIds: isAvailable ? [] : sortedRequiredFor,
  };
}

function buildDocumentReadiness(selectedSchemes: Scheme[], availableDocuments: string[]): MissingDocument[] {
  const availableDocumentNames = new Set(
    availableDocuments.map(normalizeDocumentName).filter((document) => document !== ""),
  );
  const documents = new Map<string, { displayName: string; requiredFor: string[] }>();

  [...selectedSchemes]
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach((scheme) => {
      scheme.documents.forEach((document) => {
        const normalizedName = normalizeDocumentName(document);
        if (normalizedName === "") return;

        const existing = documents.get(normalizedName);
        if (existing) {
          if (!existing.requiredFor.includes(scheme.id)) existing.requiredFor.push(scheme.id);
          return;
        }

        documents.set(normalizedName, { displayName: document.trim().replace(/\s+/g, " "), requiredFor: [scheme.id] });
      });
    });

  return [...documents.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => createDocumentResult(value.displayName, value.requiredFor, availableDocumentNames));
}

/**
 * Builds document readiness for directly supplied selected schemes.
 * Document status means marked available by the citizen, not verified.
 */
export function findMissingDocuments(selectedSchemes: Scheme[], availableDocuments: string[]): MissingDocument[];

/** Builds document readiness from a recommended bundle and the available schemes. */
export function findMissingDocuments(
  bundle: Bundle | null,
  schemes: Scheme[],
  availableDocuments: string[],
): MissingDocument[];

export function findMissingDocuments(
  selectedSchemesOrBundle: Scheme[] | Bundle | null,
  schemesOrAvailableDocuments: Scheme[] | string[],
  maybeAvailableDocuments?: string[],
): MissingDocument[] {
  if (Array.isArray(selectedSchemesOrBundle)) {
    return buildDocumentReadiness(selectedSchemesOrBundle, schemesOrAvailableDocuments as string[]);
  }

  return buildDocumentReadiness(
    selectedSchemesFromBundle(selectedSchemesOrBundle, schemesOrAvailableDocuments as Scheme[]),
    maybeAvailableDocuments ?? [],
  );
}

export const getDocumentReadiness = findMissingDocuments;
