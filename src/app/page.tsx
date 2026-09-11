import Link from "next/link";
import {
  ClipboardCheck,
  FileCheck2,
  Flag,
  ListChecks,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

const steps = [
  { number: "01", label: "Profile", icon: UserRound },
  { number: "02", label: "Eligibility", icon: ClipboardCheck },
  { number: "03", label: "Conflicts", icon: ShieldCheck },
  { number: "04", label: "Recommended Bundle", icon: ListChecks },
  { number: "05", label: "Application Plan", icon: Flag },
];

const features = [
  { title: "Find relevant schemes", icon: Search },
  { title: "Check eligibility", icon: ClipboardCheck },
  { title: "Find compatible benefits", icon: ShieldCheck },
  { title: "Know your next steps", icon: FileCheck2 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-[#fffaf6]">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-6 py-20 sm:px-10 sm:py-24 lg:px-12 lg:py-28">
            <p className="text-base font-bold text-primary">Government benefits, simplified.</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the government benefits you may be eligible for.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Scheme Sathi helps you find relevant schemes and understand what to do next.
            </p>
            <Button asChild size="lg" className="mt-9">
              <Link href="/find-benefits">Check My Benefits</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
          <div className="border-t border-border pt-7">
            <h2 className="text-2xl font-bold text-foreground">How it works</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map(({ number, label, icon: Icon }) => (
                <div key={number} className="flex items-start gap-3">
                  <Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-primary">{number}</p>
                    <p className="mt-1 font-bold text-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <h2 className="text-2xl font-bold text-foreground">Key features</h2>
            <div className="mt-8 grid gap-0 border-y border-border sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, icon: Icon }) => (
                <div key={title} className="flex items-center gap-3 border-b border-border py-5 last:border-b-0 sm:px-5 sm:even:border-l lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0">
                  <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="font-bold text-foreground">{title}</p>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="mt-10">
              <Link href="/find-benefits">Check My Benefits</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-8 sm:px-10 lg:px-12">
          <p className="font-bold text-foreground">Scheme Sathi</p>
          <p className="text-sm text-muted-foreground">Smarter access to government benefits.</p>
        </div>
      </footer>
    </div>
  );
}
