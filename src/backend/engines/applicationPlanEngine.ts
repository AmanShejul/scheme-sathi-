import type { ApplicationStep, Bundle, MissingDocument } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

function normalizeDocumentName(document: string): string {
  return document.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function usableUrl(value: string | null | undefined): string | null {
  if (!value || value.trim() === "") return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function officialUrl(scheme: Scheme): string | null {
  return usableUrl(scheme.application.portalUrl) ?? usableUrl(scheme.source.url) ?? usableUrl(scheme.source_url);
}

function selectedSchemesFromBundle(bundle: Bundle | null, schemes: Scheme[]): Scheme[] {
  if (!bundle) return [];
  const selectedIds = new Set(bundle.schemeIds);
  return schemes.filter((scheme) => selectedIds.has(scheme.id));
}

function documentsForScheme(scheme: Scheme, readiness: MissingDocument[]): string[] {
  const readinessByName = new Map<string, string>();
  readiness.forEach((item) => {
    if (!item.requiredFor.includes(scheme.id)) return;
    const normalizedName = normalizeDocumentName(item.document);
    if (normalizedName !== "" && !readinessByName.has(normalizedName)) readinessByName.set(normalizedName, item.document);
  });

  const documents = new Map<string, string>();
  scheme.documents.forEach((document) => {
    const normalizedName = normalizeDocumentName(document);
    if (normalizedName === "" || documents.has(normalizedName)) return;
    documents.set(normalizedName, readinessByName.get(normalizedName) ?? document.trim().replace(/\s+/g, " "));
  });

  readiness.forEach((item) => {
    if (!item.requiredFor.includes(scheme.id)) return;
    const normalizedName = normalizeDocumentName(item.document);
    if (normalizedName !== "" && !documents.has(normalizedName)) documents.set(normalizedName, item.document);
  });

  return [...documents.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([, document]) => document);
}

function actionForScheme(scheme: Scheme, hasPortalUrl: boolean): string {
  const metadataSteps = scheme.application.steps
    .map((step) => step.trim())
    .filter((step) => step !== "");
  if (metadataSteps.length > 0) return metadataSteps.join(" Then ");

  if (hasPortalUrl) {
    return "Review the required documents, open the official portal, and complete the application through the official authority.";
  }
  return "Review the required documents and complete the application through the official authority.";
}

function buildApplicationPlan(selectedSchemes: Scheme[], readiness: MissingDocument[]): ApplicationStep[] {
  const uniqueSchemes = new Map(selectedSchemes.map((scheme) => [scheme.id, scheme]));
  return [...uniqueSchemes.values()]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((scheme, index) => {
      const portalUrl = officialUrl(scheme);
      const documents = documentsForScheme(scheme, readiness);
      return {
        stepNumber: index + 1,
        schemeId: scheme.id,
        schemeName: scheme.name,
        action: actionForScheme(scheme, portalUrl !== null),
        documents,
        officialPortalUrl: portalUrl,
        requiredDocuments: documents,
        portalUrl,
        completed: false,
      };
    });
}

/** Generates a deterministic plan for directly supplied selected schemes. */
export function generateApplicationPlan(selectedSchemes: Scheme[], readiness: MissingDocument[]): ApplicationStep[];

/** Generates a deterministic plan from a recommended bundle and available schemes. */
export function generateApplicationPlan(
  bundle: Bundle | null,
  schemes: Scheme[],
  readiness: MissingDocument[],
): ApplicationStep[];

export function generateApplicationPlan(
  selectedSchemesOrBundle: Scheme[] | Bundle | null,
  schemesOrReadiness: Scheme[] | MissingDocument[],
  maybeReadiness?: MissingDocument[],
): ApplicationStep[] {
  if (Array.isArray(selectedSchemesOrBundle)) {
    return buildApplicationPlan(selectedSchemesOrBundle, schemesOrReadiness as MissingDocument[]);
  }

  return buildApplicationPlan(
    selectedSchemesFromBundle(selectedSchemesOrBundle, schemesOrReadiness as Scheme[]),
    maybeReadiness ?? [],
  );
}

export const createApplicationPlan = generateApplicationPlan;
