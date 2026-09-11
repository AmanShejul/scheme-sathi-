import rawSchemeSeed from "../../../data/schemes.seed.json";

import type { Scheme } from "@/types/scheme-types";

import { mapSchemeSeeds, type RawSchemeSeedFile } from "./schemeMapper";
import { validateSchemeSeed, type SchemeValidationResult } from "./schemeValidator";

const seedFile = rawSchemeSeed as RawSchemeSeedFile;
const seedRecords = seedFile.schemes;

export const schemeValidation: SchemeValidationResult = validateSchemeSeed(seedFile);
export const schemes: Scheme[] = mapSchemeSeeds(seedRecords);

export type SchemeRepositoryInitialization = {
  recordCount: number;
  hasExpectedRecordCount: boolean;
  allIdsUnique: boolean;
  hasFirstExpectedId: boolean;
  hasLastExpectedId: boolean;
  validation: SchemeValidationResult;
};

export const schemeRepositoryInitialization: SchemeRepositoryInitialization = {
  recordCount: schemes.length,
  hasExpectedRecordCount: schemes.length === 50,
  allIdsUnique: new Set(schemes.map((scheme) => scheme.id)).size === schemes.length,
  hasFirstExpectedId: schemes.some((scheme) => scheme.id === "SCH001"),
  hasLastExpectedId: schemes.some((scheme) => scheme.id === "SCH050"),
  validation: schemeValidation,
};

export function getAllSchemes(): Scheme[] {
  return schemes;
}

export function getSchemeById(id: string): Scheme | undefined {
  return schemes.find((scheme) => scheme.id === id);
}

export function getSchemesByCategory(category: string): Scheme[] {
  return schemes.filter((scheme) => scheme.category === category);
}

export function getSchemesByState(state: string): Scheme[] {
  return schemes.filter((scheme) => scheme.state === state);
}
