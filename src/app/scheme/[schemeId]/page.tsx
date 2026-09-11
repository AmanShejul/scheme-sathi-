"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function SchemeDetailsPage() {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { schemes, selectedSchemeId, selectScheme } = useSchemeSathi();
  const scheme = schemes.find((item) => item.id === schemeId) ?? schemes.find((item) => item.id === selectedSchemeId);

  useEffect(() => {
    if (scheme) selectScheme(scheme.id);
  }, [scheme, selectScheme]);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
          <p className="text-base font-bold text-primary">Scheme Details</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Scheme not found</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">This scheme is not available in the local development data.</p>
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
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{scheme.benefit.description}</p>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]"><dt className="font-bold text-muted-foreground">Category</dt><dd className="text-foreground">{scheme.category}</dd></div>
          <div className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]"><dt className="font-bold text-muted-foreground">Benefit type</dt><dd className="text-foreground">{scheme.benefit.type}</dd></div>
          <div className="grid gap-2 py-4 sm:grid-cols-[12rem_1fr]"><dt className="font-bold text-muted-foreground">Source</dt><dd className="text-foreground">{scheme.source.name}</dd></div>
        </dl>
        <Button asChild className="mt-8">
          <Link href="/results/documents">View Documents</Link>
        </Button>
      </main>
    </div>
  );
}