"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function BundlePage() {
  const { recommendedBundle, schemes } = useSchemeSathi();
  const includedSchemes = recommendedBundle?.schemeIds.map((id) => schemes.find((scheme) => scheme.id === id)).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-base font-bold text-primary">Recommended Bundle</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">A simple view of your bundle</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">This development bundle contains the scheme selected from the local placeholder data.</p>
        <div className="mt-10 border-y border-border py-7">
          <h2 className="text-2xl font-bold text-foreground">{recommendedBundle?.name ?? "No bundle available"}</h2>
          <p className="mt-3 text-muted-foreground">Included schemes: {includedSchemes.map((scheme) => scheme?.name).join(", ") || "No schemes selected"}</p>
          <p className="mt-2 text-sm text-muted-foreground">Score: {recommendedBundle?.score ?? "Not available"}</p>
        </div>
        <Button asChild className="mt-8">
          <Link href="/results/documents">View Documents</Link>
        </Button>
      </main>
    </div>
  );
}