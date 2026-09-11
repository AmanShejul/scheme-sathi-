"use client";

import {
  Check,
  Circle,
  ClipboardCheck,
  FileSearch,
  ListChecks,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

const activities = [
  { label: "Understanding citizen profile", status: "complete", icon: UserRound },
  { label: "Loading scheme knowledge", status: "complete", icon: Search },
  { label: "Evaluating eligibility", status: "complete", icon: ClipboardCheck },
  { label: "Detecting conflicts", status: "complete", icon: ShieldCheck },
  { label: "Generating compatible bundles", status: "complete", icon: ListChecks },
  { label: "Optimizing bundle", status: "current", icon: ListChecks },
  { label: "Checking documents", status: "pending", icon: FileSearch },
  { label: "Preparing application plan", status: "pending", icon: ClipboardCheck },
] as const;

export default function AnalysisPage() {
  const { analysisComplete, loading, hydrated, eligibilityResults, conflicts, recommendedBundle, runMockAnalysis } = useSchemeSathi();

  useEffect(() => {
    if (hydrated && !analysisComplete) runMockAnalysis();
  }, [hydrated, analysisComplete, runMockAnalysis]);

  const metrics = [
    { label: "Schemes Evaluated", value: String(eligibilityResults.length) },
    { label: "Potentially Eligible", value: String(eligibilityResults.filter((result) => result.status === "potentially_eligible").length) },
    { label: "Conflicts", value: String(conflicts.length) },
    { label: "Compatible Schemes", value: String(recommendedBundle?.schemeIds.length ?? 0) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-base font-bold text-primary">Analysis in progress</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Analyzing your benefits
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {loading ? "Checking your profile against the scheme knowledge base." : "Your local analysis is ready to review."}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <section aria-labelledby="activity-heading">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 id="activity-heading" className="text-xl font-bold text-foreground">
                Analysis activity
              </h2>
              <span className="text-sm text-muted-foreground">{loading ? "Working..." : "Local preview"}</span>
            </div>
            <ol className="mt-2">
              {activities.map(({ label, status, icon: Icon }, index) => (
                <li key={label} className="relative flex gap-4 py-4">
                  {index < activities.length - 1 && (
                    <span className="absolute left-[0.6875rem] top-10 h-[calc(100%-1.25rem)] w-px bg-border" aria-hidden="true" />
                  )}
                  <span
                    className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border ${
                      status === "complete"
                        ? "border-primary bg-primary text-primary-foreground"
                        : status === "current"
                          ? "border-primary bg-background text-primary"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {status === "complete" ? <Check className="size-4" aria-hidden="true" /> : status === "current" ? <Icon className="size-3.5" aria-hidden="true" /> : <Circle className="size-2.5" aria-hidden="true" />}
                  </span>
                  <div className="flex min-h-6 items-center gap-2">
                    <p className={`text-base ${status === "pending" ? "text-muted-foreground" : "font-bold text-foreground"}`}>
                      {label}
                    </p>
                    {status === "current" && <span className="text-xs font-bold text-primary">In progress</span>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="metrics-heading">
            <div className="border-b border-border pb-4">
              <h2 id="metrics-heading" className="text-xl font-bold text-foreground">
                Summary
              </h2>
            </div>
            <dl className="divide-y divide-border border-b border-border">
              {metrics.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-5">
                  <dt className="text-sm leading-5 text-muted-foreground">{label}</dt>
                  <dd className="text-2xl font-bold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {analysisComplete && <div className="mt-10 border-t border-border pt-6">
          <Button asChild size="lg">
            <Link href="/results">View Results</Link>
          </Button>
        </div>}
      </main>
    </div>
  );
}