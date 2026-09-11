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

const includedFallbackText =
  "Benefit details available in the scheme record.";

export default function BundlePage() {
  const { analysisComplete, hydrated, error, recommendedBundle, schemes, missingDocuments } = useSchemeSathi();

  if (!hydrated || !analysisComplete || !recommendedBundle) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Document readiness</p>
          <h1 className="mt-3 text-4xl font-bold">No document assessment available</h1>
          <p className="mt-5 text-muted-foreground">{error ?? "Run an analysis with a recommended bundle to review document readiness."}</p>
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
    <>
      <style>{`
        @keyframes bundle-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bundle-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bundle-soft-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(234, 88, 12, 0);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(234, 88, 12, 0.06);
          }
        }

        .bundle-fade-up {
          animation: bundle-fade-up 0.65s ease-out both;
        }

        .bundle-fade-in {
          animation: bundle-fade-in 0.7s ease-out both;
        }

        .bundle-pulse {
          animation: bundle-soft-pulse 3s ease-in-out infinite;
        }

        .bundle-card {
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease;
        }

        .bundle-card:hover {
          transform: translateY(-3px);
          border-color: rgba(234, 88, 12, 0.22);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.045);
        }

        .bundle-scheme {
          transition:
            background-color 200ms ease,
            padding-left 200ms ease;
        }

        .bundle-scheme:hover {
          background-color: #fffaf6;
          padding-left: 1.25rem;
        }

        .bundle-arrow {
          transition:
            transform 200ms ease,
            opacity 200ms ease;
        }

        .bundle-scheme:hover .bundle-arrow {
          transform: translateX(4px);
          opacity: 1;
        }

        .bundle-action {
          transition:
            transform 200ms ease,
            box-shadow 200ms ease;
        }

        .bundle-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
        }

        .bundle-icon {
          transition:
            transform 200ms ease,
            background-color 200ms ease;
        }

        .bundle-card:hover .bundle-icon {
          transform: scale(1.04);
          background-color: #fffaf6;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden bg-[#faf9f7] text-foreground">
        <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
          {/* Header */}
          <section
            className="bundle-fade-up border-b border-border pb-9"
            style={{ animationDelay: "0.05s" }}
          >
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

              <div className="bundle-pulse inline-flex items-center gap-2 self-start border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground lg:self-auto">
                <ShieldCheck
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Indicative recommendation
              </div>
            </div>
          </section>

          <section className="mt-10 border border-border bg-background p-6 sm:p-8" aria-labelledby="document-readiness-heading">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Document readiness</p>
            <h2 id="document-readiness-heading" className="mt-2 text-2xl font-bold">Documents for this bundle</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {missingDocuments.length > 0 ? missingDocuments.map((document) => (
                <div key={document.document} className="flex flex-col gap-2 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                  <div>
                    <p className="font-bold">{document.document}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Required for: {document.requiredFor.join(", ")}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{document.status === "available" ? "Marked available by citizen" : "Missing"}</span>
                </div>
              )) : <p className="px-4 py-5 text-sm text-muted-foreground">No required documents were returned for this bundle.</p>}
            </div>
          </section>

          {/* Main content */}
          <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
            {/* Bundle card */}
            <div
              className="bundle-card bundle-fade-up border border-border bg-background shadow-[0_10px_35px_rgba(0,0,0,0.035)]"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="border-b border-border bg-[#fffaf6] px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div className="bundle-icon flex size-11 shrink-0 items-center justify-center border border-border bg-background">
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
                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div
                    className="bundle-card border border-border p-5 bundle-fade-up"
                    style={{ animationDelay: "0.25s" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Included schemes
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {includedSchemes.length}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      potentially relevant benefit
                      {includedSchemes.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div
                    className="bundle-card border border-border p-5 bundle-fade-up"
                    style={{ animationDelay: "0.32s" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Bundle score
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {recommendedBundle?.score ?? "—"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Based on the current local evaluation
                    </p>
                  </div>
                </div>

                {/* Scheme list */}
                <div className="mt-9 bundle-fade-in">
                  <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">
                        Included schemes
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Benefits in this bundle
                      </h3>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {includedSchemes.length} selected
                    </span>
                  </div>

                  <div className="mt-4 divide-y divide-border border-y border-border">
                    {includedSchemes.length > 0 ? (
                      includedSchemes.map((scheme, index) => (
                        <div
                          key={scheme!.id}
                          className="bundle-scheme group flex items-start justify-between gap-5 px-4 py-5 bundle-fade-up sm:px-5"
                          style={{
                            animationDelay: `${0.38 + index * 0.1}s`,
                          }}
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <CheckCircle2
                              className="mt-0.5 size-4 shrink-0 text-primary"
                              aria-hidden="true"
                            />

                            <div className="min-w-0">
                              <p className="font-bold">{scheme!.name}</p>

                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {includedFallbackText}
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/scheme/${scheme!.id}`}
                            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary"
                          >
                            View
                            <ArrowRight
                              className="bundle-arrow size-4 opacity-50"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-12 text-center bundle-fade-in">
                        <div className="mx-auto flex size-10 items-center justify-center border border-border bg-[#fffaf6]">
                          <Info
                            className="size-4 text-primary"
                            aria-hidden="true"
                          />
                        </div>

                        <p className="mt-4 font-semibold">
                          No schemes selected
                        </p>

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
            <aside
              className="bundle-fade-up h-fit border border-border bg-[#fffaf6] p-6"
              style={{ animationDelay: "0.22s" }}
            >
              <div className="flex items-center gap-2">
                <Info
                  className="size-4 text-primary"
                  aria-hidden="true"
                />

                <p className="text-sm font-bold">Why this bundle?</p>
              </div>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                This recommendation is generated from the current local
                eligibility and compatibility evaluation. It is not an
                official government decision.
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Next step
                </p>

                <p className="mt-2 text-sm leading-6">
                  Review the documents you may need before starting an
                  application.
                </p>

                <Button
                  asChild
                  className="bundle-action mt-5 w-full"
                >
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

          {/* Navigation */}
          <div
            className="bundle-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"
            style={{ animationDelay: "0.5s" }}
          >
            <Button asChild variant="outline">
              <Link
                href="/results"
                className="transition-transform duration-200 hover:-translate-x-0.5"
              >
                Back to Results
              </Link>
            </Button>

            <Button asChild>
              <Link
                href="/results/documents"
                className="transition-transform duration-200 hover:translate-x-0.5"
              >
                Continue
                <ArrowRight
                  className="ml-2 size-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <p
            className="bundle-fade-in mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-muted-foreground"
            style={{ animationDelay: "0.6s" }}
          >
            Scheme Sathi provides an indicative recommendation. Final benefit
            eligibility and scheme compatibility should be confirmed with the
            relevant government authority.
          </p>
        </main>
      </div>
    </>
  );
}
