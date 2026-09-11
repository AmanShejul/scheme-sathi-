import type { CitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

import { normalizeEligibilityRule } from "./eligibilityRuleNormalizer";

export type EligibilityStatus =
  | "potentially_eligible"
  | "not_eligible"
  | "insufficient_data";

export type EligibilityResult = {
  schemeId: string;
  status: EligibilityStatus;
  reasons: string[];
  matchedRules: string[];
  failedRules: string[];
};

type Evaluation = {
  rule: string;
  status: "matched" | "failed" | "unknown";
  reason: string;
};

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function asValues(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

function parseBoolean(value: string) {
  const normalized = normalizeValue(value);
  if (normalized === "yes" || normalized === "true") return true;
  if (normalized === "no" || normalized === "false") return false;
  return null;
}

function parseIncome(value: string) {
  const normalized = normalizeValue(value).replace(/[₹,]/g, "");
  if (!normalized) return null;
  const matches = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(crores?|lakhs?)?/g)];
  if (matches.length === 0) return null;
  const amounts = matches.map((match) => {
    const amount = Number(match[1]);
    if (match[2]?.startsWith("crore")) return amount * 10000000;
    if (match[2]?.startsWith("lakh")) return amount * 100000;
    return amount;
  });
  return amounts.every((amount) => Number.isFinite(amount)) ? Math.max(...amounts) : null;
}

function profileValueForRule(profile: CitizenProfile, rule: string) {
  if (rule === "state") return profile.state;
  if (rule === "occupation") return profile.occupation;
  if (rule === "gender") return profile.gender;
  if (rule === "social_category") return profile.category;
  if (rule === "student") return parseBoolean(profile.studentStatus);
  if (rule === "disability") return parseBoolean(profile.disabilityStatus);
  return null;
}

function evaluateListRule(profile: CitizenProfile, rule: string, configured: unknown): Evaluation {
  const allowed = asValues(configured).map(normalizeValue);
  const actual = profileValueForRule(profile, rule);
  if (typeof actual !== "string" || !actual.trim()) {
    return { rule, status: "unknown", reason: `${rule} information is required but was not provided.` };
  }
  if (allowed.includes(normalizeValue(actual))) {
    return { rule, status: "matched", reason: `Citizen ${rule.replaceAll("_", " ")} matches the configured requirement.` };
  }
  return { rule, status: "failed", reason: `Citizen ${rule.replaceAll("_", " ")} does not match the configured requirement.` };
}

function evaluateBooleanRule(profile: CitizenProfile, rule: string, configured: unknown): Evaluation {
  if (typeof configured !== "boolean") {
    return { rule, status: "unknown", reason: `${rule.replaceAll("_", " ")} has no evaluatable boolean value.` };
  }
  const actual = profileValueForRule(profile, rule);
  if (typeof actual !== "boolean") {
    return { rule, status: "unknown", reason: `${rule.replaceAll("_", " ")} information is required but was not provided.` };
  }
  if (actual === configured) {
    return { rule, status: "matched", reason: `Citizen ${rule.replaceAll("_", " ")} matches the configured requirement.` };
  }
  return { rule, status: "failed", reason: `Citizen ${rule.replaceAll("_", " ")} does not match the configured requirement.` };
}

function evaluateAgeRule(profile: CitizenProfile, rule: string, configured: unknown): Evaluation {
  if (typeof configured !== "number" || !Number.isFinite(configured)) {
    return { rule, status: "unknown", reason: `${rule.replaceAll("_", " ")} has no evaluatable numeric value.` };
  }
  const age = Number(profile.age);
  if (!profile.age.trim() || !Number.isFinite(age)) {
    return { rule, status: "unknown", reason: "Age information is required but was not provided." };
  }
  const passes = rule === "min_age" ? age >= configured : age <= configured;
  if (passes) {
    return { rule, status: "matched", reason: `Citizen is ${age} years old and meets the ${rule === "max_age" ? "maximum" : "minimum"} age requirement.` };
  }
  return { rule, status: "failed", reason: `Citizen is ${age} years old and does not meet the ${rule === "max_age" ? "maximum" : "minimum"} age requirement of ${configured}.` };
}

function evaluateIncomeRule(profile: CitizenProfile, rule: string, configured: unknown): Evaluation {
  if (typeof configured !== "number" || !Number.isFinite(configured)) {
    return { rule, status: "unknown", reason: "Income information is required, but the scheme does not provide an explicit numeric limit." };
  }
  const income = parseIncome(profile.annualIncome);
  if (income === null) return { rule, status: "unknown", reason: "Annual family income is required but was not provided in an evaluatable format." };
  if (income <= configured) return { rule, status: "matched", reason: `Citizen income is within the configured maximum of ${configured}.` };
  return { rule, status: "failed", reason: `Citizen income exceeds the configured maximum of ${configured}.` };
}

function evaluateRule(profile: CitizenProfile, rule: string, configured: unknown): Evaluation {
  const canonicalRule = normalizeEligibilityRule(rule);
  if (configured === null || configured === undefined || (Array.isArray(configured) && configured.length === 0)) {
    return { rule: canonicalRule, status: "matched", reason: "Rule has no active configured condition." };
  }
  if (canonicalRule === "min_age" || canonicalRule === "max_age") return evaluateAgeRule(profile, canonicalRule, configured);
  if (canonicalRule === "annual_income_max") return evaluateIncomeRule(profile, canonicalRule, configured);
  if (["state", "occupation", "gender", "social_category"].includes(canonicalRule)) return evaluateListRule(profile, canonicalRule, configured);
  if (canonicalRule === "student" || canonicalRule === "disability") return evaluateBooleanRule(profile, canonicalRule, configured);
  if (configured === false) return { rule: canonicalRule, status: "matched", reason: "No positive condition is configured for this rule." };
  return { rule: canonicalRule, status: "unknown", reason: `${canonicalRule.replaceAll("_", " ")} information is required but is not supported by the current citizen profile.` };
}

export function evaluateEligibility(profile: CitizenProfile, scheme: Scheme): EligibilityResult {
  const evaluations = Object.entries(scheme.eligibility).map(([rule, configured]) => evaluateRule(profile, rule, configured));
  const matched = evaluations.filter((evaluation) => evaluation.status === "matched");
  const failed = evaluations.filter((evaluation) => evaluation.status === "failed");
  const unknown = evaluations.filter((evaluation) => evaluation.status === "unknown");
  const status: EligibilityStatus = failed.length > 0 ? "not_eligible" : unknown.length > 0 ? "insufficient_data" : "potentially_eligible";

  return {
    schemeId: scheme.id,
    status,
    reasons: evaluations.map((evaluation) => evaluation.reason),
    matchedRules: matched.map((evaluation) => evaluation.rule),
    failedRules: failed.map((evaluation) => evaluation.rule),
  };
}
