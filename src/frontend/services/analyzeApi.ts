import type { AnalyzeResponse } from "@/types/analysis-types";
import type { CitizenProfile } from "@/types/citizen-profile";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAnalysisResponse(value: unknown): value is AnalyzeResponse {
  if (!isObject(value)) return false;
  return (
    Array.isArray(value.eligibilityResults) &&
    Array.isArray(value.conflicts) &&
    (value.recommendedBundle === null || isObject(value.recommendedBundle)) &&
    Array.isArray(value.missingDocuments) &&
    Array.isArray(value.applicationPlan)
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
    throw new Error("We could not reach the analysis service. Check your connection and try again.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The analysis service returned an unreadable response. Please try again.");
  }

  if (!response.ok) {
    const errorMessage = isObject(payload) && isObject(payload.error) && typeof payload.error.message === "string" ? payload.error.message : "The analysis could not be completed.";
    throw new Error(response.status >= 500 ? "The analysis service is temporarily unavailable. Please try again." : errorMessage);
  }

  if (!isAnalysisResponse(payload)) {
    throw new Error("The analysis service returned an incomplete result. Please try again.");
  }

  return payload;
}
