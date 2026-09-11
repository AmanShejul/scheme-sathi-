"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useSchemeSathi } from "@/frontend/context/SchemeSathiContext";

export default function DocumentsPage() {
  const { citizenProfile, missingDocuments, recommendedBundle } = useSchemeSathi();
  const documents = [
    { key: "aadhaar", label: "Aadhaar" },
    { key: "incomeCertificate", label: "Income Certificate" },
    { key: "casteCertificate", label: "Caste Certificate" },
    { key: "domicileCertificate", label: "Domicile Certificate" },
    { key: "studentId", label: "Student ID" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
        <p className="text-base font-bold text-primary">Documents</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">Documents to keep ready</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">Use this checklist as a simple preparation guide for the development flow.</p>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {documents.map(({ key, label }) => {
            const requiringSchemes = missingDocuments.find((document) => document.name === label)?.schemeIds ?? [];
            return <li key={key} className="flex flex-col gap-1 py-4 font-bold text-foreground sm:flex-row sm:items-center sm:justify-between"><span>{label}</span><span className="text-sm font-normal text-muted-foreground">{requiringSchemes.length > 0 ? `Missing for ${requiringSchemes.length} scheme${requiringSchemes.length === 1 ? "" : "s"}` : citizenProfile?.documents[key as keyof typeof citizenProfile.documents] === "available" ? "Marked available by citizen" : "Not required by the recommended bundle"}</span></li>;
          })}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">Bundle: {recommendedBundle?.name ?? "No bundle available"}</p>
        <Button asChild className="mt-8">
          <Link href="/results/application-plan">Continue to Application Plan</Link>
        </Button>
      </main>
    </div>
  );
}