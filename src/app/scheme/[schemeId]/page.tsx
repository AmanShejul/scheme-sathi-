"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function SchemeDetailsPage() {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { schemes, selectedSchemeId, selectScheme, eligibilityResults, missingDocuments } = useSchemeSathi();
  const scheme = schemes.find((item) => item.id === schemeId) ?? schemes.find((item) => item.id === selectedSchemeId);
  const eligibility = eligibilityResults.find((result) => result.schemeId === scheme?.id);
  const requiredDocuments = missingDocuments.filter((document) => document.requiredFor.includes(scheme?.id ?? ""));

  useEffect(() => {
    if (scheme) selectScheme(scheme.id);
  }, [scheme, selectScheme]);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
          <p className="text-base font-bold text-primary">Scheme Details</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Scheme not found</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">We could not find this scheme in the available scheme records.</p>
          <Button asChild className="mt-8"><Link href="/results">Back to Results</Link></Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-base font-bold text-primary">Scheme Details</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">{scheme.name}</h1>
        <section className="mt-8 border-y border-border py-6" aria-labelledby="offers-heading">
          <h2 id="offers-heading" className="text-lg font-bold">What it offers</h2>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">{scheme.benefit.description}</p>
        </section>
        <section className="mt-8 border border-border bg-[#fffaf6] p-5 sm:p-6" aria-labelledby="fit-heading">
          <h2 id="fit-heading" className="text-lg font-bold">Why it may fit you</h2>
          {eligibility?.reasons.length ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{eligibility.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : <p className="mt-3 text-sm leading-6 text-muted-foreground">Based on the information currently available, this scheme may be relevant to your profile.</p>}
        </section>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]"><dt className="font-bold text-muted-foreground">Category</dt><dd className="text-foreground">{scheme.category}</dd></div>
          <div className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]"><dt className="font-bold text-muted-foreground">Benefit type</dt><dd className="text-foreground">{scheme.benefit.type}</dd></div>
          <div className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]"><dt className="font-bold text-muted-foreground">Government source link</dt><dd className="text-foreground">{scheme.source.url ? <a className="text-primary underline" href={scheme.source.url} target="_blank" rel="noreferrer">{scheme.source.name}</a> : "No source link available"}</dd></div>
        </dl>
        <section className="mt-8" aria-labelledby="documents-heading">
          <h2 id="documents-heading" className="border-b border-border pb-3 text-lg font-bold">Documents needed</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {(requiredDocuments.length > 0 ? requiredDocuments.map((document) => document.document) : scheme.documents).map((document) => <li key={document}>{document}</li>)}
          </ul>
        </section>
        <p className="mt-8 text-sm leading-6 text-muted-foreground">This is an indicative result based on the information provided. Final eligibility and approval are decided by the concerned government authority.</p>
        <Button asChild className="mt-8">
          <Link href="/results/documents">View Documents</Link>
        </Button>
      </main>
    </div>
  );
}
