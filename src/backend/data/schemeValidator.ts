export type SchemeValidationIssue = {
  index: number;
  id?: string;
  field: string;
  message: string;
};

export type SchemeValidationResult = {
  valid: boolean;
  issues: SchemeValidationIssue[];
  duplicateIds: string[];
  duplicateNames: string[];
};

type SchemeSeedFile = {
  scheme_count?: unknown;
  schemes?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidUrl(value: unknown) {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isEligibilityValue(value: unknown): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value === null || typeof value !== "string" || value.trim() !== "";
  }
  if (typeof value === "number") return Number.isFinite(value);
  if (!Array.isArray(value)) return false;
  return value.every((item) => typeof item === "string" && item.trim() !== "");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim() !== "");
}

function normalizedStringSet(value: string[]): string[] {
  return [...new Set(value.map((item) => item.trim()))].sort();
}

function sameStringSet(left: string[], right: string[]): boolean {
  return normalizedStringSet(left).join("\u0000") === normalizedStringSet(right).join("\u0000");
}

export function validateSchemes(input: unknown): SchemeValidationResult {
  const issues: SchemeValidationIssue[] = [];
  const duplicateIds: string[] = [];
  const duplicateNames: string[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const records = Array.isArray(input) ? input : [];

  if (!Array.isArray(input)) {
    issues.push({ index: -1, field: "root", message: "Scheme seed must be an array." });
  }

  records.forEach((value, index) => {
    if (!isRecord(value)) {
      issues.push({ index, field: "record", message: "Scheme record must be an object." });
      return;
    }

    const id = typeof value.id === "string" ? value.id : undefined;
    if (!id) issues.push({ index, field: "id", message: "Missing scheme ID." });
    else if (seenIds.has(id)) {
      duplicateIds.push(id);
      issues.push({ index, id, field: "id", message: "Duplicate scheme ID." });
    } else seenIds.add(id);

    const name = typeof value.name === "string" ? value.name.trim() : "";
    if (name === "") {
      issues.push({ index, id, field: "name", message: "Missing scheme name." });
    } else {
      const normalizedName = name.toLocaleLowerCase();
      if (seenNames.has(normalizedName)) {
        duplicateNames.push(name);
        issues.push({ index, id, field: "name", message: "Duplicate scheme name." });
      } else seenNames.add(normalizedName);
    }
    if (value.level !== "State" && value.level !== "Central") {
      issues.push({ index, id, field: "level", message: "Level is required and must be State or Central." });
    }
    if (value.state !== "Maharashtra" && value.state !== "All India") {
      issues.push({ index, id, field: "state", message: "State is required and must be Maharashtra or All India." });
    }
    if (!Array.isArray(value.target_groups) || value.target_groups.some((group) => typeof group !== "string" || group.trim() === "")) {
      issues.push({ index, id, field: "target_groups", message: "Target groups must be an array of non-empty strings." });
    }
    if (!isRecord(value.eligibility)) {
      issues.push({ index, id, field: "eligibility", message: "Eligibility must be an object." });
    } else {
      Object.entries(value.eligibility).forEach(([rule, configured]) => {
        if (rule.trim() === "") {
          issues.push({ index, id, field: "eligibility", message: "Eligibility rule names must be non-empty strings." });
        } else if (!isEligibilityValue(configured)) {
          issues.push({ index, id, field: `eligibility.${rule}`, message: "Eligibility rule values must be null, strings, booleans, finite numbers, or arrays of non-empty strings." });
        }
      });
    }
    if (!isRecord(value.benefit)) {
      issues.push({ index, id, field: "benefit", message: "Benefit must be an object." });
    } else {
      if (typeof value.benefit.type !== "string" || value.benefit.type.trim() === "") {
        issues.push({ index, id, field: "benefit.type", message: "Benefit type must be a non-empty string." });
      }
      if (typeof value.benefit.description !== "string" || value.benefit.description.trim() === "") {
        issues.push({ index, id, field: "benefit.description", message: "Benefit description must be a non-empty string." });
      }
    }
    if (!Array.isArray(value.documents)) issues.push({ index, id, field: "documents", message: "Documents must be an array." });
    if (!Array.isArray(value.conflicts)) {
      issues.push({ index, id, field: "conflicts", message: "Conflicts must be an array in the canonical seed schema." });
    }
    if (value.conflictsWith !== undefined && !isStringArray(value.conflictsWith)) {
      issues.push({ index, id, field: "conflictsWith", message: "conflictsWith must be an array of non-empty strings." });
    }
    if (Array.isArray(value.conflicts) && isStringArray(value.conflictsWith)) {
      if (!sameStringSet(value.conflicts, value.conflictsWith)) {
        issues.push({ index, id, field: "conflictsWith", message: "conflicts and conflictsWith must contain the same references when both are present." });
      }
    }
    if (!isValidUrl(value.source_url)) issues.push({ index, id, field: "source_url", message: "Source URL must be a valid URL." });
    if (value.application_url !== undefined && value.application_url !== null && !isValidUrl(value.application_url)) issues.push({ index, id, field: "application_url", message: "Application URL must be a valid HTTP or HTTPS URL." });
    if (typeof value.data_status !== "string" || value.data_status.trim() === "") issues.push({ index, id, field: "data_status", message: "Missing data status." });
    if (typeof value.verification_note !== "string" || value.verification_note.trim() === "") issues.push({ index, id, field: "verification_note", message: "Missing verification note." });
    if (Array.isArray(value.documents) && value.documents.some((document) => typeof document !== "string" || document.trim() === "")) issues.push({ index, id, field: "documents", message: "Documents must contain non-empty strings." });
  });

  const knownIds = new Set(records.flatMap((value) => isRecord(value) && typeof value.id === "string" ? [value.id] : []));
  records.forEach((value, index) => {
    if (!isRecord(value)) return;
    const id = typeof value.id === "string" ? value.id : undefined;
    (["conflicts", "conflictsWith"] as const).forEach((field) => {
      const references = value[field];
      if (!isStringArray(references)) return;
      references.forEach((conflict) => {
        if (!knownIds.has(conflict)) issues.push({ index, id, field, message: "Conflict reference must point to a known scheme ID." });
      });
    });
  });

  return { valid: issues.length === 0, issues, duplicateIds, duplicateNames };
}

export function validateSchemeSeed(input: unknown): SchemeValidationResult {
  if (!isRecord(input)) {
    return validateSchemes(input);
  }

  const seedFile = input as SchemeSeedFile;
  const result = validateSchemes(seedFile.schemes);
  if (typeof seedFile.scheme_count !== "number") result.issues.push({ index: -1, field: "scheme_count", message: "Missing scheme count." });
  else if (!Array.isArray(seedFile.schemes) || seedFile.scheme_count !== seedFile.schemes.length) result.issues.push({ index: -1, field: "scheme_count", message: "Declared scheme count does not match the number of records." });
  result.valid = result.issues.length === 0;
  return result;
}
