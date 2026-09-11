"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { initialCitizenProfile, type CitizenProfile, type DocumentStatus } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";
import type {
  AnalysisResult,
  Bundle,
  ConflictResult,
  EligibilityResult,
  MissingDocument,
} from "@/types/analysis-types";
import { mockSchemes } from "@/lib/mock-schemes";
import { evaluateEligibility } from "@/backend/engines/eligibilityEngine";

export type FrontendEligibilityResult = EligibilityResult;
export type FrontendConflict = ConflictResult;
export type RecommendedBundle = Bundle;

type SchemeSathiContextValue = {
  citizenProfile: CitizenProfile | null;
  selectedDocuments: string[];
  schemes: Scheme[];
  eligibilityResults: FrontendEligibilityResult[];
  conflicts: FrontendConflict[];
  recommendedBundle: RecommendedBundle | null;
  missingDocuments: MissingDocument[];
  applicationPlan: AnalysisResult["applicationPlan"];
  selectedSchemeId: string | null;
  analysisComplete: boolean;
  loading: boolean;
  hydrated: boolean;
  setCitizenProfile: (profile: CitizenProfile) => void;
  runMockAnalysis: () => Promise<void>;
  selectScheme: (schemeId: string) => void;
  resetAnalysis: () => void;
};

const SchemeSathiContext = createContext<SchemeSathiContextValue | undefined>(undefined);

const documentLabels: Array<{ key: keyof CitizenProfile["documents"]; label: string }> = [
  { key: "aadhaar", label: "Aadhaar" },
  { key: "incomeCertificate", label: "Income Certificate" },
  { key: "casteCertificate", label: "Caste Certificate" },
  { key: "domicileCertificate", label: "Domicile Certificate" },
  { key: "studentId", label: "Student ID" },
];

export function SchemeSathiProvider({ children }: { children: ReactNode }) {
  const [citizenProfile, setCitizenProfileState] = useState<CitizenProfile | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [eligibilityResults, setEligibilityResults] = useState<FrontendEligibilityResult[]>([]);
  const [conflicts, setConflicts] = useState<FrontendConflict[]>([]);
  const [recommendedBundle, setRecommendedBundle] = useState<RecommendedBundle | null>(null);
  const [missingDocuments, setMissingDocuments] = useState<MissingDocument[]>([]);
  const [applicationPlan, setApplicationPlan] = useState<AnalysisResult["applicationPlan"]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      try {
        const saved = window.sessionStorage.getItem("scheme-sathi-state");
        if (saved) {
          const state = JSON.parse(saved) as Partial<SchemeSathiContextValue>;
          if (state.citizenProfile) setCitizenProfileState(state.citizenProfile);
          if (Array.isArray(state.selectedDocuments)) setSelectedDocuments(state.selectedDocuments);
          if (Array.isArray(state.eligibilityResults)) setEligibilityResults(state.eligibilityResults);
          if (Array.isArray(state.conflicts)) setConflicts(state.conflicts);
          if (state.recommendedBundle) setRecommendedBundle(state.recommendedBundle);
          if (Array.isArray(state.missingDocuments)) setMissingDocuments(state.missingDocuments);
          if (Array.isArray(state.applicationPlan)) setApplicationPlan(state.applicationPlan);
          if (typeof state.selectedSchemeId === "string") setSelectedSchemeId(state.selectedSchemeId);
          if (typeof state.analysisComplete === "boolean") setAnalysisComplete(state.analysisComplete);
        }
      } catch {
        window.sessionStorage.removeItem("scheme-sathi-state");
      }
      setHydrated(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem("scheme-sathi-state", JSON.stringify({
        citizenProfile,
        selectedDocuments,
        eligibilityResults,
        conflicts,
        recommendedBundle,
        missingDocuments,
        applicationPlan,
        selectedSchemeId,
        analysisComplete,
      }));
    } catch {
      // Storage is optional; the in-memory context remains the source of truth.
    }
  }, [hydrated, citizenProfile, selectedDocuments, eligibilityResults, conflicts, recommendedBundle, missingDocuments, applicationPlan, selectedSchemeId, analysisComplete]);

  const clearAnalysis = useCallback(() => {
    setEligibilityResults([]);
    setConflicts([]);
    setRecommendedBundle(null);
    setMissingDocuments([]);
    setApplicationPlan([]);
    setSelectedSchemeId(null);
    setAnalysisComplete(false);
    setLoading(false);
  }, []);

  const setCitizenProfile = useCallback((profile: CitizenProfile) => {
    setCitizenProfileState(profile);
    setSelectedDocuments(documentLabels.filter(({ key }) => profile.documents[key] === "available").map(({ key }) => key));
    clearAnalysis();
  }, [clearAnalysis]);

  const runMockAnalysis = useCallback(async () => {
    setLoading(true);
    setAnalysisComplete(false);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    if (!citizenProfile) {
      clearAnalysis();
      return;
    }

    const profile = citizenProfile ?? initialCitizenProfile;
    const evaluated = mockSchemes.map((scheme) => {
      const result = evaluateEligibility(profile, scheme);
      return { schemeId: scheme.id, status: result.status, reasons: result.reasons, matchedRules: result.matchedRules, failedRules: result.failedRules };
    });
    const potentiallyEligible = evaluated.filter((result) => result.status === "potentially_eligible");
    const eligibleIds = new Set(potentiallyEligible.map((result) => result.schemeId));
    const detectedConflicts: FrontendConflict[] = [];
    mockSchemes.forEach((scheme) => {
      scheme.conflictsWith.filter((id) => eligibleIds.has(id) && eligibleIds.has(scheme.id)).forEach((conflictId) => {
        if (!detectedConflicts.some((conflict) => conflict.schemeAId === conflictId && conflict.schemeBId === scheme.id)) {
          detectedConflicts.push({ schemeA: scheme.id, schemeB: conflictId, schemeAId: scheme.id, schemeBId: conflictId, reason: "Configured scheme conflict." });
        }
      });
    });
    const excludedSchemeIds = new Set(detectedConflicts.flatMap((conflict) => [conflict.schemeB]));
    const bundleIds = potentiallyEligible.map((result) => result.schemeId).filter((id) => !excludedSchemeIds.has(id));
    const bundleSchemes = mockSchemes.filter((scheme) => bundleIds.includes(scheme.id));
    const missing = Array.from(new Set(bundleSchemes.flatMap((scheme) => scheme.documents))).map((document) => ({
      document,
      requiredFor: bundleSchemes.filter((candidate) => candidate.documents.includes(document)).map((candidate) => candidate.id),
      status: selectedDocuments.includes(document) ? "available" as const : "missing" as const,
      name: document,
      schemeIds: bundleSchemes.filter((candidate) => candidate.documents.includes(document) && !selectedDocuments.includes(document)).map((candidate) => candidate.id),
    })).filter((item) => item.status === "missing");

    const steps = bundleSchemes.map((scheme, index) => ({
      stepNumber: index + 1,
      schemeId: scheme.id,
      schemeName: scheme.name,
      action: scheme.application.steps[0] ?? "Review the official application information for this scheme.",
      documents: scheme.documents,
      officialPortalUrl: scheme.application.portalUrl ?? scheme.source.url ?? null,
      requiredDocuments: scheme.documents,
      portalUrl: scheme.application.portalUrl ?? scheme.source.url ?? null,
      completed: false,
    }));

    setEligibilityResults(evaluated);
    setConflicts(detectedConflicts);
    setRecommendedBundle(bundleSchemes.length > 0 ? {
      name: "Recommended Development Bundle",
      schemeIds: bundleSchemes.map((scheme) => scheme.id),
      score: bundleSchemes.length,
      reasons: ["Selected from potentially eligible schemes after removing configured conflicts."],
      explanation: "Selected from potentially eligible schemes after removing configured conflicts.",
      excludedSchemes: [...excludedSchemeIds],
      excludedSchemeIds: [...excludedSchemeIds],
    } : null);
    setMissingDocuments(missing);
    setApplicationPlan(steps);
    setLoading(false);
    setAnalysisComplete(true);
  }, [citizenProfile, clearAnalysis, selectedDocuments]);

  const selectScheme = useCallback((schemeId: string) => {
    setSelectedSchemeId(schemeId);
  }, []);

  const resetAnalysis = useCallback(() => {
    setCitizenProfileState(null);
    setSelectedDocuments([]);
    clearAnalysis();
  }, [clearAnalysis]);

  const value = useMemo(
    () => ({
      citizenProfile,
      selectedDocuments,
      schemes: mockSchemes,
      eligibilityResults,
      conflicts,
      recommendedBundle,
      missingDocuments,
      applicationPlan,
      selectedSchemeId,
      analysisComplete,
      loading,
      hydrated,
      setCitizenProfile,
      runMockAnalysis,
      selectScheme,
      resetAnalysis,
    }),
    [citizenProfile, selectedDocuments, eligibilityResults, conflicts, recommendedBundle, missingDocuments, applicationPlan, selectedSchemeId, analysisComplete, loading, hydrated, setCitizenProfile, runMockAnalysis, selectScheme, resetAnalysis],
  );

  return <SchemeSathiContext.Provider value={value}>{children}</SchemeSathiContext.Provider>;
}

export function useSchemeSathi() {
  const context = useContext(SchemeSathiContext);
  if (!context) throw new Error("useSchemeSathi must be used inside SchemeSathiProvider");
  return context;
}

export function getDocumentStatus(profile: CitizenProfile | null, key: keyof CitizenProfile["documents"]): DocumentStatus {
  return profile?.documents[key] ?? "";
}
