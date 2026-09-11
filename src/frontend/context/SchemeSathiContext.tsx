"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { type CitizenProfile, type DocumentStatus } from "@/types/citizen-profile";
import type { Scheme } from "@/types/scheme-types";
import type {
  AnalysisResult,
  Bundle,
  ConflictResult,
  EligibilityResult,
  MissingDocument,
} from "@/types/analysis-types";
import { analyzeCitizen } from "@/frontend/services/analyzeApi";
import { fetchSchemes } from "@/frontend/services/schemesApi";

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
  analysisResult: AnalysisResult | null;
  selectedSchemeId: string | null;
  analysisComplete: boolean;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  setCitizenProfile: (profile: CitizenProfile) => void;
  runAnalysis: (profileOverride?: CitizenProfile) => Promise<boolean>;
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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    let active = true;
    void fetchSchemes().then((loadedSchemes) => {
      if (active) setSchemes(loadedSchemes);
    }).catch(() => {
      if (active) setSchemes([]);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      try {
        const saved = window.sessionStorage.getItem("scheme-sathi-state");
        if (saved) {
          const state = JSON.parse(saved) as Partial<SchemeSathiContextValue>;
          if (state.citizenProfile) setCitizenProfileState(state.citizenProfile);
          if (Array.isArray(state.selectedDocuments)) {
            const legacyDocumentKeys = new Map(documentLabels.map(({ key, label }) => [key, label]));
            setSelectedDocuments(state.selectedDocuments.map((document) => legacyDocumentKeys.get(document as keyof CitizenProfile["documents"]) ?? document));
          }
          if (state.analysisResult) {
            setAnalysisResult(state.analysisResult);
            setEligibilityResults(state.analysisResult.eligibilityResults);
            setConflicts(state.analysisResult.conflicts);
            setRecommendedBundle(state.analysisResult.recommendedBundle);
            setMissingDocuments(state.analysisResult.missingDocuments);
            setApplicationPlan(state.analysisResult.applicationPlan);
          } else {
            if (Array.isArray(state.eligibilityResults)) setEligibilityResults(state.eligibilityResults);
            if (Array.isArray(state.conflicts)) setConflicts(state.conflicts);
            if (state.recommendedBundle) setRecommendedBundle(state.recommendedBundle);
            if (Array.isArray(state.missingDocuments)) setMissingDocuments(state.missingDocuments);
            if (Array.isArray(state.applicationPlan)) setApplicationPlan(state.applicationPlan);
          }
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
        analysisResult,
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
  }, [hydrated, citizenProfile, selectedDocuments, analysisResult, eligibilityResults, conflicts, recommendedBundle, missingDocuments, applicationPlan, selectedSchemeId, analysisComplete]);

  const clearAnalysis = useCallback(() => {
    setEligibilityResults([]);
    setConflicts([]);
    setRecommendedBundle(null);
    setMissingDocuments([]);
    setApplicationPlan([]);
    setAnalysisResult(null);
    setSelectedSchemeId(null);
    setAnalysisComplete(false);
    setLoading(false);
    setError(null);
  }, []);

  const setCitizenProfile = useCallback((profile: CitizenProfile) => {
    setCitizenProfileState(profile);
    setSelectedDocuments(documentLabels.filter(({ key }) => profile.documents[key] === "available").map(({ label }) => label));
    clearAnalysis();
  }, [clearAnalysis]);

  const runAnalysis = useCallback(async (profileOverride?: CitizenProfile) => {
    if (loading) return false;
    const profileToAnalyze = profileOverride ?? citizenProfile;
    if (!profileToAnalyze) {
      setError("Please complete your citizen profile before starting the analysis.");
      return false;
    }

    if (profileOverride) {
      setCitizenProfileState(profileOverride);
      setSelectedDocuments(documentLabels.filter(({ key }) => profileOverride.documents[key] === "available").map(({ label }) => label));
    }
    setLoading(true);
    setAnalysisComplete(false);
    setError(null);
    try {
      const result = await analyzeCitizen(profileToAnalyze, profileOverride ? documentLabels.filter(({ key }) => profileOverride.documents[key] === "available").map(({ label }) => label) : selectedDocuments);
      setAnalysisResult(result);
      setEligibilityResults(result.eligibilityResults);
      setConflicts(result.conflicts);
      setRecommendedBundle(result.recommendedBundle);
      setMissingDocuments(result.missingDocuments);
      setApplicationPlan(result.applicationPlan);
      setAnalysisComplete(true);
      return true;
    } catch (analysisError) {
      setAnalysisResult(null);
      setEligibilityResults([]);
      setConflicts([]);
      setRecommendedBundle(null);
      setMissingDocuments([]);
      setApplicationPlan([]);
      setAnalysisComplete(false);
      setError(analysisError instanceof Error ? analysisError.message : "The analysis could not be completed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [citizenProfile, loading, selectedDocuments]);

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
      schemes,
      eligibilityResults,
      conflicts,
      recommendedBundle,
      missingDocuments,
      applicationPlan,
      analysisResult,
      selectedSchemeId,
      analysisComplete,
      loading,
      error,
      hydrated,
      setCitizenProfile,
      runAnalysis,
      selectScheme,
      resetAnalysis,
    }),
    [citizenProfile, selectedDocuments, schemes, eligibilityResults, conflicts, recommendedBundle, missingDocuments, applicationPlan, analysisResult, selectedSchemeId, analysisComplete, loading, error, hydrated, setCitizenProfile, runAnalysis, selectScheme, resetAnalysis],
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
