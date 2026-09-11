import type { AnalysisExplanation, AnalyzeResponse } from "@/types/analysis-types";
import type { CitizenProfile } from "@/types/citizen-profile";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnalysisExplanation(value: unknown): value is AnalysisExplanation {
  if (!isObject(value)) return false;
  return (
    typeof value.summary === "string" &&
    isStringArray(value.whyRecommended) &&
    isStringArray(value.missingInformationExplanation) &&
    isStringArray(value.nextSteps)
  );
}

function isAnalysisResponse(value: unknown): value is AnalyzeResponse {
  if (!isObject(value)) return false;
  return (
    Array.isArray(value.eligibilityResults) &&
    Array.isArray(value.conflicts) &&
    (value.recommendedBundle === null || isObject(value.recommendedBundle)) &&
    Array.isArray(value.missingDocuments) &&
    Array.isArray(value.applicationPlan) &&
    (value.aiExplanation === undefined || value.aiExplanation === null || isAnalysisExplanation(value.aiExplanation))
  );
}

export async function analyzeCitizen(
  citizenProfile: CitizenProfile,
  availableDocuments: string[],
): Promise<AnalyzeResponse> {
  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizenProfile, availableDocuments }),
    });
  } catch {
    throw new Error("We could not reach the analysis. Check your connection and try again.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The analysis returned an unreadable response. Please try again.");
  }

  if (!response.ok) {
    throw new Error(response.status >= 500 ? "The analysis is temporarily unavailable. Please try again." : "Please check your profile details and try again.");
  }

  if (!isAnalysisResponse(payload)) {
    throw new Error("The analysis returned incomplete results. Please try again.");
  }

  return payload;
}
