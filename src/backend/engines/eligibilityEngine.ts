import type { CitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

export type EligibilityStatus =
  | "potentially_eligible"
  | "not_eligible"
  | "insufficient_data";

export type EligibilityResult = {
  status: EligibilityStatus;
  reasons: string[];
  matchedRules: string[];
  failedRules: string[];
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function parseBoolean(value: string) {
  const normalizedValue = normalize(value);
  if (["yes", "true"].includes(normalizedValue)) return true;
  if (["no", "false"].includes(normalizedValue)) return false;
  return null;
}

function parseIncome(value: string) {
  const normalizedValue = normalize(value).replace(/,/g, "");
  if (!normalizedValue) return null;

  const amounts = [...normalizedValue.matchAll(/(\d+(?:\.\d+)?)\s*(crores?|lakhs?)?/g)].map((match) => {
    const amount = Number(match[1]);
    const unit = match[2];
    if (unit?.startsWith("crore")) return amount * 10000000;
    if (unit?.startsWith("lakh")) return amount * 100000;
    return amount;
  });

  if (amounts.length === 0 || amounts.some((amount) => Number.isNaN(amount))) return null;
  return Math.max(...amounts);
}

function addMatch(result: EligibilityResult, rule: string, reason: string) {
  result.matchedRules.push(rule);
  result.reasons.push(reason);
}

function addFailure(result: EligibilityResult, rule: string, reason: string) {
  result.failedRules.push(rule);
  result.reasons.push(reason);
}

export function evaluateEligibility(profile: CitizenProfile, scheme: Scheme): EligibilityResult {
  const result: EligibilityResult = {
    status: "potentially_eligible",
    reasons: [],
    matchedRules: [],
    failedRules: [],
  };
  const missingInformation: string[] = [];
  const eligibility = scheme.eligibility;
  const age = profile.age ? Number(profile.age) : null;
  const income = profile.annualIncome ? parseIncome(profile.annualIncome) : null;

  if (eligibility.minAge !== undefined && eligibility.minAge !== null) {
    if (age === null || Number.isNaN(age)) missingInformation.push("Age is required to evaluate the minimum age rule.");
    else if (age >= eligibility.minAge) addMatch(result, `minAge >= ${eligibility.minAge}`, "Age meets the minimum age requirement.");
    else addFailure(result, `minAge >= ${eligibility.minAge}`, `Age must be at least ${eligibility.minAge}.`);
  }

  if (eligibility.maxAge !== undefined && eligibility.maxAge !== null) {
    if (age === null || Number.isNaN(age)) missingInformation.push("Age is required to evaluate the maximum age rule.");
    else if (age <= eligibility.maxAge) addMatch(result, `maxAge <= ${eligibility.maxAge}`, "Age meets the maximum age requirement.");
    else addFailure(result, `maxAge <= ${eligibility.maxAge}`, `Age must be ${eligibility.maxAge} or below.`);
  }

  if (eligibility.maxIncome !== undefined && eligibility.maxIncome !== null) {
    if (income === null) missingInformation.push("Annual family income is required to evaluate the income rule.");
    else if (income <= eligibility.maxIncome) addMatch(result, `maxIncome <= ${eligibility.maxIncome}`, "Annual family income is within the configured limit.");
    else addFailure(result, `maxIncome <= ${eligibility.maxIncome}`, "Annual family income is above the configured limit.");
  }

  if (eligibility.states && eligibility.states.length > 0) {
    if (!profile.state.trim()) missingInformation.push("State is required to evaluate the state rule.");
    else if (eligibility.states.some((state) => normalize(state) === normalize(profile.state))) addMatch(result, "states", "State matches an eligible state.");
    else addFailure(result, "states", "State does not match the configured eligible states.");
  }

  if (eligibility.occupations && eligibility.occupations.length > 0) {
    if (!profile.occupation.trim()) missingInformation.push("Occupation is required to evaluate the occupation rule.");
    else if (eligibility.occupations.some((occupation) => normalize(occupation) === normalize(profile.occupation))) addMatch(result, "occupations", "Occupation matches an eligible occupation.");
    else addFailure(result, "occupations", "Occupation does not match the configured eligible occupations.");
  }

  if (eligibility.categories && eligibility.categories.length > 0) {
    if (!profile.category.trim()) missingInformation.push("Category is required to evaluate the category rule.");
    else if (eligibility.categories.some((category) => normalize(category) === normalize(profile.category))) addMatch(result, "categories", "Category matches an eligible category.");
    else addFailure(result, "categories", "Category does not match the configured eligible categories.");
  }

  if (eligibility.student !== undefined && eligibility.student !== null) {
    const student = profile.studentStatus ? parseBoolean(profile.studentStatus) : null;
    if (student === null) missingInformation.push("Student status is required to evaluate the student rule.");
    else if (student === eligibility.student) addMatch(result, `student = ${eligibility.student}`, "Student status matches the configured requirement.");
    else addFailure(result, `student = ${eligibility.student}`, "Student status does not match the configured requirement.");
  }

  if (eligibility.disability !== undefined && eligibility.disability !== null) {
    const disability = profile.disabilityStatus ? parseBoolean(profile.disabilityStatus) : null;
    if (disability === null) missingInformation.push("Disability status is required to evaluate the disability rule.");
    else if (disability === eligibility.disability) addMatch(result, `disability = ${eligibility.disability}`, "Disability status matches the configured requirement.");
    else addFailure(result, `disability = ${eligibility.disability}`, "Disability status does not match the configured requirement.");
  }

  if (missingInformation.length > 0) {
    result.status = "insufficient_data";
    result.reasons = [...missingInformation, ...result.reasons];
  } else if (result.failedRules.length > 0) {
    result.status = "not_eligible";
  }

  return result;
}
