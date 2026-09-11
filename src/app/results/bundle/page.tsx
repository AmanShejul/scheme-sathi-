"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";
import { userFacingAnalysisError } from "@/frontend/utils/presentation";

export default function BundlePage() {
  const { analysisComplete, hydrated, error, recommendedBundle, schemes } = useSchemeSathi();

  if (!hydrated || !analysisComplete || !recommendedBundle) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Recommended bundle</p>
          <h1 className="mt-3 text-4xl font-bold">No bundle available</h1>
          <p className="mt-5 text-muted-foreground">{userFacingAnalysisError(error)}</p>
          <Button asChild className="mt-8"><Link href="/results">Back to Results</Link></Button>
        </div>
      </main>
    );
  }

  const includedSchemes =
    recommendedBundle?.schemeIds
      .map((id) => schemes.find((scheme) => scheme.id === id))
      .filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-[#faf9f7] text-foreground">
      <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        {/* Header */}
        <section className="border-b border-border pb-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                Recommended bundle
              </p>

              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                A clearer view of your recommended benefits
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Scheme Sathi groups compatible benefits into a single
                recommendation so you can understand what to consider next.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground lg:self-auto">
              <ShieldCheck
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Indicative recommendation
            </div>
          </div>
        </section>

        {/* Bundle overview */}
        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* Main card */}
          <div className="border border-border bg-background shadow-[0_10px_35px_rgba(0,0,0,0.035)]">
            <div className="border-b border-border bg-[#fffaf6] px-6 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center border border-border bg-background">
                  <Layers3
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Selected bundle
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {recommendedBundle?.name ?? "No bundle available"}
                  </h2>
                </div>
              </div>
            </div>

            <div className="px-6 py-7 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Included schemes
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {includedSchemes.length}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    potentially relevant benefit
                    {includedSchemes.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="border border-border bg-[#fffaf6] p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Why it was selected</p>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-foreground">
                    {recommendedBundle.reasons.map((reason) => <p key={reason}>{reason}</p>)}
                  </div>
                </div>
              </div>

              {/* Scheme list */}
              <div className="mt-8">
                <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                      Included schemes
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      Benefits in this bundle
                    </h3>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-border border-y border-border">
                  {includedSchemes.length > 0 ? (
                    includedSchemes.map((scheme) => (
                      <div
                        key={scheme!.id}
                        className="group flex items-start justify-between gap-5 px-4 py-5 transition-colors duration-200 hover:bg-[#fffaf6] sm:px-5"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />

                          <div className="min-w-0">
                            <p className="font-bold">{scheme!.name}</p>

                           <p className="mt-1 text-sm leading-6 text-muted-foreground">
  Benefit details available in the scheme record.
</p>
                          </div>
                        </div>

                        <Link
                          href={`/scheme/${scheme!.id}`}
                          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1"
                        >
                          View
                          <ArrowRight
                            className="size-4"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <p className="font-semibold">No schemes selected</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Complete an analysis to generate a recommendation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <aside className="h-fit border border-border bg-[#fffaf6] p-6">
            <div className="flex items-center gap-2">
              <Info
                className="size-4 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm font-bold">Why this bundle?</p>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              This recommendation is based on the information you provided
              and the scheme records available to us. It is not an official
              government decision.
            </p>

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Next step
              </p>

              <p className="mt-2 text-sm leading-6">
                Review the documents you may need before starting an
                application.
              </p>

              <Button asChild className="mt-5 w-full">
                <Link href="/results/documents">
                  View Documents
                  <ArrowRight
                    className="ml-2 size-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </aside>
        </section>

        {/* Bottom navigation */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button asChild variant="outline">
            <Link href="/results">Back to Results</Link>
          </Button>

          <Button asChild>
            <Link href="/results/documents">
              Continue
              <ArrowRight
                className="ml-2 size-4"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-muted-foreground">
          Scheme Sathi provides an indicative recommendation. Final benefit
          eligibility and scheme compatibility should be confirmed with the
          relevant government authority.
        </p>
      </main>
    </div>
  );
}
