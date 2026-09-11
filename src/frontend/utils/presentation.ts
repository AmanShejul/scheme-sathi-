import type { MissingDocument } from "@/types/analysis-types";
import type { Scheme } from "@/types/scheme-types";

export function resolveSchemeName(schemes: Scheme[], schemeId: string): string {
  return schemes.find((scheme) => scheme.id === schemeId)?.name ?? "Related scheme";
}

export function documentStatusLabel(document: MissingDocument): string {
  return document.status === "available" ? "Marked available by citizen" : "Not marked available";
}

export function userFacingAnalysisError(message: string | null): string {
  if (!message) return "We could not complete the analysis. Please review your profile and try again.";
  return message;
}
