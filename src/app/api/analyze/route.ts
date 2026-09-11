import type { AnalyzeRequest, AnalysisResult } from "@/types/analysis-types";

import { AnalysisServiceError, analyze } from "@/backend/services/analysisService";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidRequest(message: string): Response {
  return Response.json({ error: { code: "invalid_request", message } }, { status: 400 });
}

function internalError(): Response {
  return Response.json(
    { error: { code: "internal_error", message: "The analysis service could not complete the request." } },
    { status: 500 },
  );
}

function isAnalyzeRequest(value: unknown): value is AnalyzeRequest {
  if (!isObject(value)) return false;
  if (!isObject(value.citizenProfile)) return false;
  return Array.isArray(value.availableDocuments) && value.availableDocuments.every((document) => typeof document === "string");
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalidRequest("Request body must contain valid JSON.");
  }

  if (!isAnalyzeRequest(payload)) {
    return invalidRequest("Request must include citizenProfile and availableDocuments.");
  }

  try {
    const result: AnalysisResult = analyze(payload.citizenProfile, payload.availableDocuments);
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof AnalysisServiceError && error.code === "invalid_profile") {
      return invalidRequest("citizenProfile must match the required profile shape.");
    }
    return internalError();
  }
}
