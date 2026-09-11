import { initialCitizenProfile } from "@/types/citizen-profile";
import type { AnalysisResult } from "@/types/analysis-types";

import { generateAnalysisExplanation, buildGeminiPrompt } from "./geminiService";

const profile = { ...initialCitizenProfile, age: "22", state: "Maharashtra", occupation: "student" };
const analysisResult: AnalysisResult = {
  eligibilityResults: [{ schemeId: "scheme-a", status: "potentially_eligible", reasons: ["State matched."], matchedRules: ["state"], failedRules: [] }],
  conflicts: [],
  recommendedBundle: { name: "Recommended bundle", schemeIds: ["scheme-a"], score: 80, reasons: ["Strong profile match."], excludedSchemes: [] },
  missingDocuments: [{ document: "Aadhaar", requiredFor: ["scheme-a"], status: "missing", name: "Aadhaar", schemeIds: ["scheme-a"] }],
  applicationPlan: [{ stepNumber: 1, schemeId: "scheme-a", schemeName: "Example Scheme", action: "Review the required documents.", documents: ["Aadhaar"], officialPortalUrl: null, requiredDocuments: ["Aadhaar"] }],
};

const validModelResponse = JSON.stringify({
  summary: "The deterministic analysis found one potentially eligible scheme.",
  whyRecommended: ["The selected bundle has a strong profile match."],
  missingInformationExplanation: ["Aadhaar is marked missing for the selected scheme."],
  nextSteps: ["Review the required documents."],
});

export async function runGeminiServiceExamples() {
  const before = JSON.stringify(analysisResult);
  const valid = await generateAnalysisExplanation(analysisResult, profile, { apiKey: "test-key", generateText: async () => validModelResponse });
  if (!valid || valid.summary !== "The deterministic analysis found one potentially eligible scheme.") throw new Error("Valid mocked Gemini response was not accepted.");
  if (JSON.stringify(analysisResult) !== before) throw new Error("Gemini service mutated deterministic analysis results.");

  const malformed = await generateAnalysisExplanation(analysisResult, profile, { apiKey: "test-key", generateText: async () => "not-json" });
  if (malformed !== null) throw new Error("Malformed output was not rejected safely.");

  const missingKey = await generateAnalysisExplanation(analysisResult, profile, { apiKey: "" });
  if (missingKey !== null) throw new Error("Missing GEMINI_API_KEY did not return null.");

  const unavailable = await generateAnalysisExplanation(analysisResult, profile, { apiKey: "test-key", generateText: async () => { throw new Error("provider failure"); } });
  if (unavailable !== null) throw new Error("Provider failure did not return null.");

  const prompt = buildGeminiPrompt(analysisResult, profile);
  if (!prompt.includes("Never infer or invent eligibility") || !prompt.includes("SUPPLIED_DETERMINISTIC_DATA_START")) {
    throw new Error("Gemini prompt safety instructions are incomplete.");
  }
  if (!prompt.includes("scheme-a") || !prompt.includes("Aadhaar")) throw new Error("Prompt omitted deterministic facts.");

  return { valid, malformed, missingKey, unavailable };
}
