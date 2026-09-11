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
          <p className="mt-5 text-muted-foreground">{error ?? "Run an analysis with a recommended bundle to generate an application plan."}</p>
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
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Use this guide to review the returned scheme requirements and continue through the official authority process.</p>
        <p className="mt-5 text-sm text-muted-foreground">Bundle: {recommendedBundle?.name ?? "No bundle available"}</p>
        <ol className="mt-10 list-decimal space-y-4 border-y border-border py-7 pl-6 text-foreground">
          {applicationPlan.length > 0 ? applicationPlan.map((step) => <li key={`${step.stepNumber}-${step.schemeId}`}><span className="font-bold">{step.schemeName}:</span> {step.action}<span className="mt-1 block text-sm text-muted-foreground">Documents: {step.documents.join(", ") || "None configured"}</span></li>) : <li className="list-none text-muted-foreground">No application steps were returned.</li>}
        </ol>
        <p className="text-sm text-muted-foreground">Missing documents: {missingDocuments.map((document) => document.name).join(", ") || "None"}</p>
        {portalStep?.officialPortalUrl && <Button asChild className="mt-8"><a href={portalStep.officialPortalUrl} target="_blank" rel="noreferrer">Open Official Portal</a></Button>}
        <Button asChild variant="outline" className="ml-3 mt-8">
          <Link href="/find-benefits" onClick={resetAnalysis}>Start Over</Link>
        </Button>
      </main>
    </div>
  );
}
