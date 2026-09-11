import { initialCitizenProfile, type CitizenProfile } from "@/types/citizen-profile";

import { analyze } from "./analysisService";

const studentOBCProfile: CitizenProfile = {
  ...initialCitizenProfile,
  age: "22",
  state: "Maharashtra",
  occupation: "student",
  category: "OBC",
  studentStatus: "Yes",
  disabilityStatus: "No",
  annualIncome: "Rs. 1 lakh - Rs. 3 lakh",
};

const farmerProfile: CitizenProfile = {
  ...initialCitizenProfile,
  age: "40",
  state: "Maharashtra",
  occupation: "farmer",
};

const incompleteProfile: CitizenProfile = { ...initialCitizenProfile };

export const analysisServiceExamples = {
  studentOBC: analyze(studentOBCProfile, ["Aadhaar", "Income Certificate"]),
  farmer: analyze(farmerProfile, ["Aadhaar"]),
  incomplete: analyze(incompleteProfile, []),
  noPotentiallyEligibleSchemes: analyze({ ...initialCitizenProfile, occupation: "not-a-configured-occupation" }, []),
  oneRecommendedScheme: analyze({ ...farmerProfile, occupation: "tenant_farmer" }, ["Aadhaar"]),
  multipleCandidateBundles: analyze(farmerProfile, ["Aadhaar", "Income Certificate", "Land Record"]),
  missingDocuments: analyze(farmerProfile, []),
  noAvailableDocuments: analyze(studentOBCProfile, []),
};

export function runAnalysisServiceExamples() {
  const entries = Object.entries(analysisServiceExamples);
  entries.forEach(([name, result]) => {
    if (result.eligibilityResults.length === 0) throw new Error(`${name} did not populate eligibility results.`);
    if (!result.recommendedBundle && (result.missingDocuments.length !== 0 || result.applicationPlan.length !== 0)) {
      throw new Error(`${name} produced downstream output without a recommended bundle.`);
    }
    if (result.recommendedBundle) {
      const selectedIds = new Set(result.recommendedBundle.schemeIds);
      result.applicationPlan.forEach((step) => {
        if (!selectedIds.has(step.schemeId)) throw new Error(`${name} application plan contains an unselected scheme.`);
      });
      result.missingDocuments.forEach((document) => {
        document.requiredFor.forEach((schemeId) => {
          if (!selectedIds.has(schemeId)) throw new Error(`${name} document references an unselected scheme.`);
        });
      });
    }
  });

  const incompleteMissing = analysisServiceExamples.incomplete.eligibilityResults.filter((result) => result.status === "insufficient_data");
  if (incompleteMissing.length === 0) throw new Error("incomplete did not produce insufficient_data results.");

  const noPotentialResult = analysisServiceExamples.noPotentiallyEligibleSchemes;
  const potentialCount = noPotentialResult.eligibilityResults.filter((result) => result.status === "potentially_eligible").length;
  if (potentialCount === 0) {
    if (noPotentialResult.recommendedBundle !== null || noPotentialResult.applicationPlan.length !== 0) {
      throw new Error("A profile with no potentially eligible schemes produced downstream output.");
    }
  } else if (!noPotentialResult.recommendedBundle) {
    throw new Error("Potentially eligible schemes did not produce a recommended bundle.");
  }

  return analysisServiceExamples;
}
