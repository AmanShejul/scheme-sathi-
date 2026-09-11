"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function ApplicationPlanPage() {
  const { analysisComplete, hydrated, error, applicationPlan, recommendedBundle, missingDocuments, resetAnalysis } = useSchemeSathi();

  if (!hydrated || !analysisComplete || !recommendedBundle) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Application Plan</p>
          <h1 className="mt-3 text-4xl font-bold">No application plan available</h1>
          <p className="mt-5 text-muted-foreground">{error ?? "Complete your profile to generate an application plan."}</p>
          <Button asChild className="mt-8"><Link href="/results">Back to Results</Link></Button>
        </div>
      </main>
    );
  }

  const portalStep = applicationPlan.find((step) => Boolean(step.officialPortalUrl));

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-base font-bold text-primary">Application Plan</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Plan your next step</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Use these steps to prepare and continue with the concerned government authority.</p>
        <p className="mt-5 text-sm text-muted-foreground">Recommended combination: {recommendedBundle.name}</p>
        <ol className="mt-10 space-y-5 border-y border-border py-7">
          {applicationPlan.length > 0 ? applicationPlan.map((step) => <li key={`${step.stepNumber}-${step.schemeId}`} className="border border-border p-5"><p className="text-xs font-bold uppercase tracking-wide text-primary">Step {step.stepNumber}</p><h2 className="mt-2 text-lg font-bold">{step.action}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Scheme: {step.schemeName}</p><p className="mt-3 text-sm leading-6 text-foreground">What you need to do: {step.action}</p><p className="mt-2 text-sm text-muted-foreground">Documents needed: {step.documents.join(", ") || "No documents were listed for this step."}</p></li>) : <li className="list-none text-muted-foreground">No application steps were returned.</li>}
        </ol>
        <p className="text-sm text-muted-foreground">Documents not marked available: {missingDocuments.filter((document) => document.status === "missing").map((document) => document.document).join(", ") || "None"}</p>
        {portalStep?.officialPortalUrl && <Button asChild className="mt-8"><a href={portalStep.officialPortalUrl} target="_blank" rel="noreferrer">Open Official Portal</a></Button>}
        <Button asChild variant="outline" className="ml-3 mt-8">
          <Link href="/find-benefits" onClick={resetAnalysis}>Start Over</Link>
        </Button>
        <p className="mt-8 text-sm leading-6 text-muted-foreground">Scheme Sathi helps you prepare. Final application and approval are handled by the concerned government authority.</p>
      </main>
    </div>
  );
}
