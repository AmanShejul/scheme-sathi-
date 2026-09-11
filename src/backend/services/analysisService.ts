import type { AnalysisResult, EligibilityResult } from "@/types/analysis-types";
import type { CitizenProfile } from "@/types/citizen-profile";

import { getAllSchemes, schemeValidation } from "../data/schemeRepository";
import { generateApplicationPlan } from "../engines/applicationPlanEngine";
import { generateBundles } from "../engines/bundleEngine";
import { optimizeBundle } from "../engines/bundleOptimizer";
import { detectConflicts } from "../engines/conflictEngine";
import { findMissingDocuments } from "../engines/documentEngine";
import { evaluateEligibility } from "../engines/eligibilityEngine";
import { findMissingInformation, type MissingInformationResult } from "../engines/missingInformationEngine";

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

function runEligibility(schemes: ReturnType<typeof getAllSchemes>, profile: CitizenProfile): EligibilityResult[] {
  return schemes.map((scheme) => evaluateEligibility(profile, scheme));
}

/** Runs the complete deterministic Scheme Sathi analysis pipeline. */
export function analyze(profile: CitizenProfile, availableDocuments: string[]): AnalysisResult {
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
    const eligibilityResults = runEligibility(schemes, profile);
    const resultsByScheme = new Map(eligibilityResults.map((result) => [result.schemeId, result]));
    const missingInformation: MissingInformationResult[] = eligibilityResults
      .filter((result) => result.status === "insufficient_data")
      .map((result) => {
        const scheme = schemes.find((candidate) => candidate.id === result.schemeId);
        if (!scheme) throw new Error(`Eligibility result references unknown scheme ${result.schemeId}.`);
        return findMissingInformation(scheme, profile, result);
      });
    const potentiallyEligibleSchemes = schemes.filter((scheme) => resultsByScheme.get(scheme.id)?.status === "potentially_eligible");
    const conflicts = detectConflicts(potentiallyEligibleSchemes);
    const candidates = generateBundles(potentiallyEligibleSchemes, conflicts);
    const recommendedBundle = optimizeBundle(profile, candidates, eligibilityResults, missingInformation);

    if (!recommendedBundle) {
      return {
        eligibilityResults,
        conflicts,
        recommendedBundle: null,
        missingDocuments: [],
        applicationPlan: [],
      };
    }

    const missingDocuments = findMissingDocuments(recommendedBundle, potentiallyEligibleSchemes, availableDocuments);
    const applicationPlan = generateApplicationPlan(recommendedBundle, potentiallyEligibleSchemes, missingDocuments);
    return { eligibilityResults, conflicts, recommendedBundle, missingDocuments, applicationPlan };
  } catch (error) {
    if (error instanceof AnalysisServiceError) throw error;
    throw new AnalysisServiceError("engine_failure", `Analysis engine failure: ${formatError(error)}`);
  }
}

export const runAnalysis = analyze;
