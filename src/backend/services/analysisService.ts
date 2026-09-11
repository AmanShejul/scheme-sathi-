import type { AnalysisExplanation, AnalysisResult } from "@/types/analysis-types";
import type { CitizenProfile } from "@/types/citizen-profile";

import { getAllSchemes, schemeValidation } from "../data/schemeRepository";
import { generateAnalysisExplanation } from "./geminiService";
import { runAgent } from "./agentService";

export type AnalysisServiceErrorCode = "invalid_profile" | "repository_failure" | "validation_failure" | "engine_failure";

export class AnalysisServiceError extends Error {
  readonly code: AnalysisServiceErrorCode;

  constructor(code: AnalysisServiceErrorCode, message: string) {
    super(message);
    this.name = "AnalysisServiceError";
    this.code = code;
  }
}

function isDocumentStatus(value: unknown): value is CitizenProfile["documents"][keyof CitizenProfile["documents"]] {
  return value === "" || value === "available" || value === "not-available" || value === "not-sure";
}

function isValidCitizenProfile(value: unknown): value is CitizenProfile {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const profile = value as Record<string, unknown>;
  const stringFields = [
    "age",
    "gender",
    "state",
    "city",
    "annualIncome",
    "occupation",
    "category",
    "studentStatus",
    "disabilityStatus",
    "familySize",
  ];
  if (stringFields.some((field) => typeof profile[field] !== "string")) return false;
  if (!Array.isArray(profile.existingBenefits) || profile.existingBenefits.some((item) => typeof item !== "string")) return false;
  if (typeof profile.documents !== "object" || profile.documents === null || Array.isArray(profile.documents)) return false;
  return Object.values(profile.documents as Record<string, unknown>).every(isDocumentStatus);
}

function validateInputs(profile: CitizenProfile, availableDocuments: string[]): void {
  if (!isValidCitizenProfile(profile)) {
    throw new AnalysisServiceError("invalid_profile", "Analysis requires a valid CitizenProfile shape.");
  }
  if (!Array.isArray(availableDocuments) || availableDocuments.some((document) => typeof document !== "string")) {
    throw new AnalysisServiceError("invalid_profile", "Analysis requires availableDocuments to be an array of strings.");
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown failure.";
}

/** Runs the complete Scheme Sathi analysis through the controlled agent orchestrator. */
export async function analyze(profile: CitizenProfile, availableDocuments: string[]): Promise<AnalysisResult> {
  validateInputs(profile, availableDocuments);

  let schemes: ReturnType<typeof getAllSchemes>;
  try {
    schemes = [...getAllSchemes()].sort((left, right) => left.id.localeCompare(right.id));
  } catch (error) {
    throw new AnalysisServiceError("repository_failure", `Unable to load schemes: ${formatError(error)}`);
  }

  if (!schemeValidation.valid) {
    const issueSummary = schemeValidation.issues.map((issue) => `${issue.field}: ${issue.message}`).join("; ");
    throw new AnalysisServiceError("validation_failure", `Scheme repository validation failed${issueSummary ? `: ${issueSummary}` : "."}`);
  }

  try {
    const deterministicResult = runAgent({ citizenProfile: profile, availableDocuments, schemes }).analysisResult;
    let aiExplanation: AnalysisExplanation | null = null;
    try {
      aiExplanation = await generateAnalysisExplanation(deterministicResult, profile);
    } catch {
      aiExplanation = null;
    }
    return { ...deterministicResult, aiExplanation };
  } catch (error) {
    if (error instanceof AnalysisServiceError) throw error;
    throw new AnalysisServiceError("engine_failure", `Analysis engine failure: ${formatError(error)}`);
  }
}

export const runAnalysis = analyze;
