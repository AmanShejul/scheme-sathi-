import { initialCitizenProfile } from "@/types/citizen-profile";

import { POST } from "./route";

const studentProfile = {
  ...initialCitizenProfile,
  age: "22",
  state: "Maharashtra",
  occupation: "student",
  category: "OBC",
  studentStatus: "Yes",
  disabilityStatus: "No",
  annualIncome: "Rs. 1 lakh - Rs. 3 lakh",
};

const farmerProfile = {
  ...initialCitizenProfile,
  age: "40",
  state: "Maharashtra",
  occupation: "farmer",
};

async function request(body: string): Promise<Response> {
  return POST(new Request("http://localhost/api/analyze", { method: "POST", body, headers: { "content-type": "application/json" } }));
}

async function responseBody(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

export async function runAnalyzeRouteExamples() {
  const validStudent = await request(JSON.stringify({ citizenProfile: studentProfile, availableDocuments: ["Aadhaar"] }));
  const validFarmer = await request(JSON.stringify({ citizenProfile: farmerProfile, availableDocuments: [] }));
  const malformedJson = await request("{\"citizenProfile\":");
  const missingProfile = await request(JSON.stringify({ availableDocuments: [] }));
  const invalidDocuments = await request(JSON.stringify({ citizenProfile: studentProfile, availableDocuments: ["Aadhaar", 4] }));
  const serviceValidationError = await request(JSON.stringify({ citizenProfile: {}, availableDocuments: [] }));

  const studentBody = await responseBody(validStudent);
  const farmerBody = await responseBody(validFarmer);
  const malformedBody = await responseBody(malformedJson);
  const missingProfileBody = await responseBody(missingProfile);
  const invalidDocumentsBody = await responseBody(invalidDocuments);
  const serviceErrorBody = await responseBody(serviceValidationError);

  if (validStudent.status !== 200 || !Array.isArray(studentBody.eligibilityResults)) throw new Error("Valid student request failed.");
  if (validFarmer.status !== 200 || !Array.isArray(farmerBody.eligibilityResults)) throw new Error("Valid farmer request failed.");
  if (malformedJson.status !== 400 || malformedBody.error === undefined) throw new Error("Malformed JSON was not rejected.");
  if (missingProfile.status !== 400 || missingProfileBody.error === undefined) throw new Error("Missing profile was not rejected.");
  if (invalidDocuments.status !== 400 || invalidDocumentsBody.error === undefined) throw new Error("Invalid availableDocuments was not rejected.");
  if (serviceValidationError.status !== 400 || serviceErrorBody.error === undefined) throw new Error("Service invalid_profile was not mapped to HTTP 400.");

  return { validStudent, validFarmer, malformedJson, missingProfile, invalidDocuments, serviceValidationError };
}
