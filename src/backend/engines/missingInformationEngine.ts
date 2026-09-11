import type { CitizenProfile } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";

import type { EligibilityResult } from "./eligibilityEngine";
import { normalizeEligibilityRule } from "./eligibilityRuleNormalizer";

export type MissingInformationItem = {
  field: string;
  label: string;
  reason: string;
};

export type MissingInformationResult = {
  schemeId: string;
  missingInformation: MissingInformationItem[];
};

type InformationMapping = {
  field: string;
  label: string;
  getValue: (profile: CitizenProfile) => string;
};

const mappings: Record<string, InformationMapping> = {
  state: {
    field: "state",
    label: "State",
    getValue: (profile) => profile.state,
  },
  occupation: {
    field: "occupation",
    label: "Occupation",
    getValue: (profile) => profile.occupation,
  },
  gender: {
    field: "gender",
    label: "Gender",
    getValue: (profile) => profile.gender,
  },
  social_category: {
    field: "category",
    label: "Social category",
    getValue: (profile) => profile.category,
  },
  student: {
    field: "studentStatus",
    label: "Student status",
    getValue: (profile) => profile.studentStatus,
  },
  disability: {
    field: "disabilityStatus",
    label: "Disability status",
    getValue: (profile) => profile.disabilityStatus,
  },
  min_age: {
    field: "age",
    label: "Age",
    getValue: (profile) => profile.age,
  },
  max_age: {
    field: "age",
    label: "Age",
    getValue: (profile) => profile.age,
  },
  annual_income_max: {
    field: "annualIncome",
    label: "Annual family income",
    getValue: (profile) => profile.annualIncome,
  },
  academic_merit_required: {
    field: "academicMerit",
    label: "Academic merit",
    getValue: () => "",
  },
  academic_criteria: {
    field: "academicMerit",
    label: "Academic merit",
    getValue: () => "",
  },
  income_criteria: {
    field: "annualIncome",
    label: "Annual family income",
    getValue: (profile) => profile.annualIncome,
  },
  scheme_database_eligibility: {
    field: "schemeDatabaseEligibility",
    label: "Scheme database eligibility",
    getValue: () => "",
  },
  scheme_eligibility_record: {
    field: "schemeDatabaseEligibility",
    label: "Scheme database eligibility",
    getValue: () => "",
  },
  landholder: {
    field: "landholderStatus",
    label: "Landholder status",
    getValue: () => "",
  },
  land_required: {
    field: "landOwnership",
    label: "Land ownership or access",
    getValue: () => "",
  },
  landholding_on_cutoff_date: {
    field: "landholdingStatus",
    label: "Landholding status on the required date",
    getValue: () => "",
  },
  pregnancy: {
    field: "pregnancyStatus",
    label: "Pregnancy status",
    getValue: () => "",
  },
  pregnancy_or_lactation: {
    field: "pregnancyOrLactationStatus",
    label: "Pregnancy or lactation status",
    getValue: () => "",
  },
  rural_resident: {
    field: "residenceType",
    label: "Rural or urban residence",
    getValue: () => "",
  },
  urban_resident: {
    field: "residenceType",
    label: "Rural or urban residence",
    getValue: () => "",
  },
  residence_type: {
    field: "residenceType",
    label: "Rural or urban residence",
    getValue: () => "",
  },
};

function humanizeRule(rule: string) {
  return rule.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function activeRules(scheme: Scheme) {
  return Object.entries(scheme.eligibility).map(([rule, value]) => [normalizeEligibilityRule(rule), value] as const).filter(([, value]) => {
    if (value === null || value === undefined) return false;
    return !(Array.isArray(value) && value.length === 0);
  });
}

function isUnresolvedRule(rule: string, result: EligibilityResult) {
  return !result.matchedRules.includes(rule) && !result.failedRules.includes(rule);
}

function resolveRule(rule: string, profile: CitizenProfile): MissingInformationItem {
  const mapping = mappings[rule];
  if (mapping) {
    const supplied = mapping.getValue(profile).trim();
    return {
      field: mapping.field,
      label: mapping.label,
      reason: supplied
        ? `The scheme's ${mapping.label.toLowerCase()} condition could not be evaluated from the configured rule.`
        : `This scheme requires ${mapping.label.toLowerCase()} information, but it was not provided.`,
    };
  }

  const label = humanizeRule(rule);
  return {
    field: rule,
    label,
    reason: `This scheme requires ${label.toLowerCase()} information, but the current citizen profile cannot provide it.`,
  };
}

export function findMissingInformation(
  scheme: Scheme,
  profile: CitizenProfile,
  eligibilityResult: EligibilityResult,
): MissingInformationResult {
  if (eligibilityResult.status !== "insufficient_data") {
    return { schemeId: scheme.id, missingInformation: [] };
  }

  const missingInformation: MissingInformationItem[] = [];
  activeRules(scheme).forEach(([rule]) => {
    if (!isUnresolvedRule(rule, eligibilityResult)) return;
    const item = resolveRule(rule, profile);
    if (!missingInformation.some((existing) => existing.field === item.field)) {
      missingInformation.push(item);
    }
  });

  return { schemeId: scheme.id, missingInformation };
}
