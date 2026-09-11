"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";
import { resolveSchemeName, userFacingAnalysisError } from "@/frontend/utils/presentation";

export default function ResultsPage() {
  const { analysisComplete, hydrated, error, eligibilityResults, conflicts, recommendedBundle, schemes, missingDocuments, selectScheme } = useSchemeSathi();

  if (!hydrated || !analysisComplete) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
          <p className="text-base font-bold text-primary">Results</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">No analysis result yet</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{userFacingAnalysisError(error) ?? "Complete your profile to view your results."}</p>
          <Button asChild className="mt-8"><Link href="/find-benefits">Start analysis</Link></Button>
        </main>
      </div>
    );
  }

  const potentiallyEligible = eligibilityResults.filter((result) => result.status === "potentially_eligible");
  const otherResults = eligibilityResults.filter((result) => result.status !== "potentially_eligible");
  const potentiallyEligibleSchemes = potentiallyEligible.map((result) => ({
    scheme: schemes.find((candidate) => candidate.id === result.schemeId),
    result,
  })).filter(({ scheme }) => scheme !== undefined);
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
              <p className="mt-2 text-sm text-muted-foreground">Based on the information you provided and the scheme records available to us.</p>
            </div>
          </div>
          <div className="mt-5 border border-border">
            {potentiallyEligibleSchemes.length === 0 ? <p className="px-5 py-5 text-sm text-muted-foreground">No potentially eligible schemes were found from the current analysis.</p> : (
              <div className="divide-y divide-border">
                {potentiallyEligibleSchemes.map(({ scheme, result }) => (
                  <div key={scheme!.id} className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-bold text-foreground">{scheme!.name}</h3>
                        <span className="border border-primary px-2 py-1 text-xs font-bold text-primary">Potentially Eligible</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Category: {scheme!.category}</p>
                      <p className="mt-5 leading-7 text-foreground">{scheme!.benefit.description}</p>
                      <div className="mt-5">
                        <p className="text-sm font-bold text-foreground">Eligibility reasons</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                        </ul>
                      </div>
                      <p className="mt-5 text-sm text-muted-foreground"><span className="font-bold text-foreground">Document readiness:</span> {missingDocuments.filter((document) => document.requiredFor.includes(scheme!.id) && document.status === "missing").length} missing</p>
                    </div>
                    <Button asChild variant="outline" className="shrink-0">
                      <Link href={`/scheme/${scheme!.id}`} onClick={() => selectScheme(scheme!.id)}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="why-heading">
          <h2 id="why-heading" className="border-b border-border pb-4 text-xl font-bold text-foreground">Why these may fit you</h2>
          <div className="mt-5 border border-border px-5 py-5 sm:px-7">
            {potentiallyEligibleSchemes.length > 0 ? <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {potentiallyEligibleSchemes.flatMap(({ scheme, result }) => result.reasons.map((reason) => <li key={`${scheme!.id}-${reason}`}>{reason}</li>))}
            </ul> : <p className="text-sm text-muted-foreground">No potentially eligible schemes were returned for this profile.</p>}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="conflicts-heading">
          <h2 id="conflicts-heading" className="border-b border-border pb-4 text-xl font-bold text-foreground">Compatibility and conflicts</h2>
          <div className="mt-5 border border-border px-5 py-5 sm:px-7">
            {conflicts.length > 0 ? conflicts.map((conflict) => (
              <div key={`${conflict.schemeAId}-${conflict.schemeBId}`}>
                <p className="font-bold text-foreground">{resolveSchemeName(schemes, conflict.schemeAId)} <span className="font-normal text-muted-foreground">and</span> {resolveSchemeName(schemes, conflict.schemeBId)}</p>
                <p className="mt-2 text-sm text-muted-foreground">{conflict.reason}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No explicit conflicts were found among the potentially eligible schemes.</p>}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="other-results-heading">
          <h2 id="other-results-heading" className="border-b border-border pb-4 text-xl font-bold text-muted-foreground">Other eligibility outcomes</h2>
          <div className="mt-5 border border-border px-5 py-5 sm:px-7">
            {otherResults.length > 0 ? otherResults.map((result) => (
              <div key={result.schemeId} className="border-b border-border py-3 last:border-b-0 first:pt-0 last:pb-0">
                <p className="font-bold text-muted-foreground">{resolveSchemeName(schemes, result.schemeId)}</p>
                <p className="mt-2 text-sm text-muted-foreground">{result.status === "insufficient_data" ? "Insufficient information" : "Not eligible"}: {result.reasons.join(" ") || "No additional explanation was returned."}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No other eligibility outcomes were recorded.</p>}
          </div>
        </section>

        <section className="mt-14 border-y border-border bg-[#fffaf6] px-5 py-7 sm:px-7" aria-labelledby="bundle-heading">
          <p className="text-sm font-bold text-primary">Recommended Benefit Combination</p>
          <h2 id="bundle-heading" className="mt-2 text-2xl font-bold text-foreground">{recommendedBundle?.name ?? "No recommended combination yet"}</h2>
          <p className="mt-3 text-sm text-muted-foreground">Included schemes: {recommendedBundle?.schemeIds.map((id) => resolveSchemeName(schemes, id)).join(", ") || "None yet"}</p>
          {recommendedBundle?.reasons.map((reason) => <p key={reason} className="mt-2 text-sm text-muted-foreground">{reason}</p>)}
          {recommendedBundle ? <Button asChild className="mt-6"><Link href="/results/bundle">View Recommended Combination</Link></Button> : <Button asChild variant="outline" className="mt-6"><Link href="/find-benefits">Review your profile</Link></Button>}
        </section>

        <section className="mt-14 border-t border-border pt-7" aria-labelledby="next-step-heading">
          <p className="text-sm font-bold text-primary">Next Step</p>
          <h2 id="next-step-heading" className="mt-2 text-2xl font-bold text-foreground">Documents you still need</h2>
          <p className="mt-2 text-sm text-muted-foreground">{missingDocuments.filter((document) => document.status === "missing").length} document{missingDocuments.filter((document) => document.status === "missing").length === 1 ? "" : "s"} were not marked available for the recommended combination.</p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/results/documents">View Document Readiness</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}
