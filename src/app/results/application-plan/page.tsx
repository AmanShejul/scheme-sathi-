"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function ApplicationPlanPage() {
  const { applicationPlan, recommendedBundle, missingDocuments, resetAnalysis } = useSchemeSathi();

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-base font-bold text-primary">Application Plan</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Plan your next step</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Follow the official instructions for the selected development placeholder when verified information is available.</p>
        <p className="mt-5 text-sm text-muted-foreground">Bundle: {recommendedBundle?.name ?? "No bundle available"}</p>
        <ol className="mt-10 list-decimal space-y-4 border-y border-border py-7 pl-6 text-foreground">
          {applicationPlan.map((step) => <li key={step.stepNumber}><span className="font-bold">{step.schemeName}:</span> {step.action}<span className="mt-1 block text-sm text-muted-foreground">Documents: {step.requiredDocuments.join(", ") || "None configured"}</span></li>)}
        </ol>
        <p className="text-sm text-muted-foreground">Missing documents: {missingDocuments.map((document) => document.name).join(", ") || "None"}</p>
        <Button asChild className="mt-8">
          <Link href={applicationPlan[0]?.portalUrl ?? "#"} target="_blank" rel="noreferrer">Open Official Portal</Link>
        </Button>
        <Button asChild variant="outline" className="ml-3 mt-8">
          <Link href="/find-benefits" onClick={resetAnalysis}>Start Over</Link>
        </Button>
      </main>
    </div>
  );
}