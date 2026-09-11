"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function ResultsPage() {
  const { analysisComplete, hydrated, eligibilityResults, conflicts, recommendedBundle, schemes, missingDocuments, runMockAnalysis, selectScheme } = useSchemeSathi();

  useEffect(() => {
    if (hydrated && !analysisComplete) runMockAnalysis();
  }, [hydrated, analysisComplete, runMockAnalysis]);

  const potentiallyEligible = eligibilityResults.filter((result) => result.status === "potentially_eligible");
  const notEligible = eligibilityResults.filter((result) => result.status === "not_eligible");
  const primaryMockScheme = schemes.find((scheme) => scheme.id === potentiallyEligible[0]?.schemeId);
  const eligibilityReasons = potentiallyEligible[0]?.reasons ?? [];
  const notEligibleScheme = schemes.find((scheme) => scheme.id === notEligible[0]?.schemeId) ?? schemes[1];
  const metrics = [
    ["Schemes Evaluated", String(eligibilityResults.length)],
    ["Potentially Eligible", String(potentiallyEligible.length)],
    ["Conflicts", String(conflicts.length)],
    ["Recommended Bundle", recommendedBundle ? "1" : "0"],
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-base font-bold text-primary">Results</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Your benefit analysis</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Here is what Scheme Sathi found from your profile.</p>

        <section className="mt-10" aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="text-xl font-bold text-foreground">Summary</h2>
          <dl className="mt-4 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-border px-4 py-5 last:border-b-0 sm:border-r sm:px-5 sm:even:border-b-0 lg:border-b-0 lg:last:border-r-0">
                <dt className="text-sm leading-5 text-muted-foreground">{label}</dt>
                <dd className="text-2xl font-bold text-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14" aria-labelledby="eligible-heading">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 id="eligible-heading" className="text-xl font-bold text-foreground">Potentially Eligible</h2>
              <p className="mt-2 text-sm text-muted-foreground">Results based on the completed local profile and scheme data.</p>
            </div>
          </div>
          <div className="mt-5 border border-border">
            {!primaryMockScheme ? <p className="px-5 py-5 text-sm text-muted-foreground">No potentially eligible schemes were found from the current analysis.</p> : (
            <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold text-foreground">{primaryMockScheme.name}</h3>
                  <span className="border border-primary px-2 py-1 text-xs font-bold text-primary">Potentially Eligible</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Category: {primaryMockScheme.category}</p>
                <p className="mt-5 leading-7 text-foreground">{primaryMockScheme.benefit.description}</p>
                <div className="mt-5">
                  <p className="text-sm font-bold text-foreground">Eligibility reasons</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {eligibilityReasons.map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                </div>
                <p className="mt-5 text-sm text-muted-foreground"><span className="font-bold text-foreground">Document readiness:</span> Not assessed in this preview</p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                  <Link href={`/scheme/${primaryMockScheme.id}`} onClick={() => selectScheme(primaryMockScheme.id)}>View Details</Link>
              </Button>
            </div>
            )}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="conflicts-heading">
          <h2 id="conflicts-heading" className="border-b border-border pb-4 text-xl font-bold text-foreground">Conflicts</h2>
          <div className="mt-5 border border-border px-5 py-5 sm:px-7">
            {conflicts.length > 0 ? conflicts.map((conflict) => (
              <div key={`${conflict.schemeAId}-${conflict.schemeBId}`}>
                <p className="font-bold text-foreground">{schemes.find((scheme) => scheme.id === conflict.schemeAId)?.name} <span className="font-normal text-muted-foreground">and</span> {schemes.find((scheme) => scheme.id === conflict.schemeBId)?.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{conflict.reason}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No configured conflicts were found.</p>}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="not-eligible-heading">
          <h2 id="not-eligible-heading" className="border-b border-border pb-4 text-xl font-bold text-muted-foreground">Not Eligible</h2>
          <div className="mt-5 border border-border px-5 py-5 sm:px-7">
            <p className="font-bold text-muted-foreground">{notEligibleScheme?.name ?? "No schemes"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{notEligible[0]?.reasons.join(" ") || "No not-eligible schemes were recorded."}</p>
          </div>
        </section>

        <section className="mt-14 border-y border-border bg-[#fffaf6] px-5 py-7 sm:px-7" aria-labelledby="bundle-heading">
          <p className="text-sm font-bold text-primary">Recommended Bundle</p>
          <h2 id="bundle-heading" className="mt-2 text-2xl font-bold text-foreground">{recommendedBundle?.name ?? "No bundle available"}</h2>
          <p className="mt-3 text-sm text-muted-foreground">Included schemes: {recommendedBundle?.schemeIds.map((id) => schemes.find((scheme) => scheme.id === id)?.name).filter(Boolean).join(", ") || "None"}</p>
          <p className="mt-2 text-sm text-muted-foreground">Score: {recommendedBundle?.score ?? "Not available"}</p>
          <p className="mt-2 text-sm text-muted-foreground">{recommendedBundle?.explanation ?? "No compatible bundle was created."}</p>
          <Button asChild className="mt-6">
            <Link href="/results/bundle">View Bundle</Link>
          </Button>
        </section>

        <section className="mt-14 border-t border-border pt-7" aria-labelledby="next-step-heading">
          <p className="text-sm font-bold text-primary">Next Step</p>
          <h2 id="next-step-heading" className="mt-2 text-2xl font-bold text-foreground">Continue to Documents</h2>
          <p className="mt-2 text-sm text-muted-foreground">{missingDocuments.length} document gap{missingDocuments.length === 1 ? "" : "s"} identified from your profile.</p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/results/documents">View Document Readiness</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}