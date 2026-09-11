import type { Scheme } from "@/types/scheme-types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isScheme(value: unknown): value is Scheme {
  if (!isObject(value)) return false;
  const source = value.source;
  const benefit = value.benefit;
  const application = value.application;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.category === "string" &&
    isObject(value.eligibility) &&
    isObject(benefit) &&
    typeof benefit.type === "string" &&
    typeof benefit.description === "string" &&
    isStringArray(value.documents) &&
    isStringArray(value.conflictsWith) &&
    isObject(source) &&
    typeof source.name === "string" &&
    typeof source.url === "string" &&
    isObject(application) &&
    typeof application.mode === "string" &&
    isStringArray(application.steps) &&
    (application.portalUrl === null || typeof application.portalUrl === "string") &&
    typeof value.developmentOnly === "boolean"
  );
}

export async function fetchSchemes(): Promise<Scheme[]> {
  let response: Response;
  try {
    response = await fetch("/api/schemes", { method: "GET" });
  } catch {
    throw new Error("We could not load the scheme records. Please try again.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The scheme records returned an unreadable response.");
  }

  if (!response.ok || !Array.isArray(payload) || !payload.every(isScheme)) {
    throw new Error("The scheme records could not be loaded.");
  }

  return payload;
}
