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

export function validateSchemes(input: unknown): SchemeValidationResult {
  const issues: SchemeValidationIssue[] = [];
  const duplicateIds: string[] = [];
  const seenIds = new Set<string>();
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

    if (typeof value.name !== "string" || value.name.trim() === "") {
      issues.push({ index, id, field: "name", message: "Missing scheme name." });
    }
    if (!isRecord(value.eligibility)) issues.push({ index, id, field: "eligibility", message: "Eligibility must be an object." });
    if (!isRecord(value.benefit)) issues.push({ index, id, field: "benefit", message: "Benefit must be an object." });
    if (!Array.isArray(value.documents)) issues.push({ index, id, field: "documents", message: "Documents must be an array." });
    if (!Array.isArray(value.conflicts) && !Array.isArray(value.conflictsWith)) issues.push({ index, id, field: "conflicts", message: "Conflicts must be an array." });
    if (!isValidUrl(value.source_url)) issues.push({ index, id, field: "source_url", message: "Source URL must be a valid URL." });
    if (value.application_url !== undefined && value.application_url !== null && !isValidUrl(value.application_url)) issues.push({ index, id, field: "application_url", message: "Application URL must be a valid HTTP or HTTPS URL." });
    if (typeof value.data_status !== "string" || value.data_status.trim() === "") issues.push({ index, id, field: "data_status", message: "Missing data status." });
    if (typeof value.verification_note !== "string" || value.verification_note.trim() === "") issues.push({ index, id, field: "verification_note", message: "Missing verification note." });
    if (value.level !== undefined && value.level !== "State" && value.level !== "Central") issues.push({ index, id, field: "level", message: "Level must be State or Central." });
    if (value.state !== undefined && typeof value.state !== "string") issues.push({ index, id, field: "state", message: "State must be a string." });
    if (Array.isArray(value.documents) && value.documents.some((document) => typeof document !== "string" || document.trim() === "")) issues.push({ index, id, field: "documents", message: "Documents must contain non-empty strings." });
  });

  const knownIds = new Set(records.flatMap((value) => isRecord(value) && typeof value.id === "string" ? [value.id] : []));
  records.forEach((value, index) => {
    if (!isRecord(value) || !Array.isArray(value.conflicts)) return;
    value.conflicts.forEach((conflict) => {
      if (typeof conflict !== "string" || !knownIds.has(conflict)) issues.push({ index, id: typeof value.id === "string" ? value.id : undefined, field: "conflicts", message: "Conflict reference must point to a known scheme ID." });
    });
  });

  return { valid: issues.length === 0, issues, duplicateIds };
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
