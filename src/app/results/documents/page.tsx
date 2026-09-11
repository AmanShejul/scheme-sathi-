"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";
import { documentStatusLabel, resolveSchemeName, userFacingAnalysisError } from "@/frontend/utils/presentation";

export default function DocumentsPage() {
  const { analysisComplete, hydrated, error, recommendedBundle, schemes, missingDocuments } = useSchemeSathi();

  if (!hydrated || !analysisComplete) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Document readiness</p>
          <h1 className="mt-3 text-4xl font-bold">Complete your profile to view your results.</h1>
          <p className="mt-5 text-muted-foreground">{userFacingAnalysisError(error)}</p>
          <Button asChild className="mt-8"><Link href="/find-benefits">Review your profile</Link></Button>
        </div>
      </main>
    );
  }

  if (!recommendedBundle) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Document readiness</p>
          <h1 className="mt-3 text-4xl font-bold">No recommended combination yet</h1>
          <p className="mt-5 text-muted-foreground">There is no selected combination of schemes to prepare documents for yet.</p>
          <Button asChild className="mt-8"><Link href="/results">Review your results</Link></Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Document readiness</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">Documents you need</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Review the documents connected to the recommended combination. Availability is based only on what you marked in your profile.</p>

        <section className="mt-10" aria-labelledby="documents-heading">
          <h2 id="documents-heading" className="text-xl font-bold">Your document list</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {missingDocuments.length > 0 ? missingDocuments.map((document) => (
              <div key={document.document} className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                <div>
                  <h3 className="font-bold">{document.document}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Related to: {document.requiredFor.map((schemeId) => resolveSchemeName(schemes, schemeId)).join(", ") || "Related scheme"}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{documentStatusLabel(document)}</span>
              </div>
            )) : <p className="px-4 py-6 text-sm text-muted-foreground">No required documents were returned for this combination.</p>}
          </div>
        </section>

        <section className="mt-10 border border-border bg-[#fffaf6] p-5 sm:p-6" aria-labelledby="bundle-summary-heading">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Recommended combination</p>
          <h2 id="bundle-summary-heading" className="mt-2 text-xl font-bold">{recommendedBundle.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{recommendedBundle.schemeIds.map((schemeId) => resolveSchemeName(schemes, schemeId)).join(", ")}</p>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button asChild variant="outline"><Link href="/results">Back to Results</Link></Button>
          <Button asChild><Link href="/results/application-plan">Continue to Application Plan</Link></Button>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-muted-foreground">Documents are marked according to your profile response. Scheme Sathi does not verify authenticity or approval.</p>
      </div>
    </main>
  );
}
