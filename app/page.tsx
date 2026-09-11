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

import { SiteHeader } from "@/components/site-header";
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
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-[#fffaf6]">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-2 bg-primary"
          />

          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-12 lg:py-24">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-12 bg-primary" />

                <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  Government benefits, simplified
                </p>
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Find benefits
                <span className="block text-primary">
                  made for you.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Scheme Sathi helps you find relevant schemes and understand
                what to do next.
              </p>

              <Button asChild size="lg" className="mt-10">
                <Link href="/find-benefits">Check My Benefits</Link>
              </Button>
            </div>

            {/* Hero Information Card */}
            <div className="relative">
              <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
                <p className="text-sm font-bold uppercase tracking-wider text-primary">
                  Your journey
                </p>

                <div className="mt-6 space-y-5">
                  {steps.slice(0, 3).map(({ number, label, icon: Icon }) => (
                    <div
                      key={number}
                      className="flex items-center gap-4"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center border border-border bg-muted">
                        <Icon
                          className="size-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-primary">
                          STEP {number}
                        </p>

                        <p className="mt-1 font-bold text-foreground">
                          {label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 border-t border-border pt-5">
                  <p className="text-sm leading-6 text-muted-foreground">
                    A simple guided process to help you understand your
                    available government benefits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Simple process
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How Scheme Sathi works
            </h2>

            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Follow a clear step-by-step journey to discover the benefits
              that may be relevant to you.
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-12">
            <div className="grid gap-0 border border-border lg:grid-cols-5">
              {steps.map(({ number, label, icon: Icon }, index) => (
                <div
                  key={number}
                  className={`relative min-h-52 border-b border-border p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 ${
                    index % 2 === 0 ? "bg-card" : "bg-muted/40"
                  }`}
                >
                  <p className="text-4xl font-bold tracking-tight text-primary/20">
                    {number}
                  </p>

                  <div className="mt-8 flex size-12 items-center justify-center border border-border bg-background">
                    <Icon
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-5 font-bold text-foreground">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                  What you get
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Everything you need to get started
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Clear guidance designed to make government benefits easier to
                understand.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, icon: Icon }, index) => (
                <article
                  key={title}
                  className="group border border-border bg-card p-6 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-bold text-primary">
                      0{index + 1}
                    </span>

                    <div className="flex size-11 items-center justify-center bg-muted">
                      <Icon
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <h3 className="mt-10 text-lg font-bold leading-snug text-foreground">
                    {title}
                  </h3>
                </article>
              ))}
            </div>

            <div className="mt-12 border-t border-border pt-10">
              <Button asChild size="lg">
                <Link href="/find-benefits">Check My Benefits</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
          <div className="border border-border bg-card p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Get started
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Discover the benefits that may be available to you.
              </h2>
            </div>

            <Button asChild size="lg" className="mt-8 lg:mt-0">
              <Link href="/find-benefits">Check My Benefits</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-foreground text-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p className="text-lg font-bold">Scheme Sathi</p>

          <p className="text-sm opacity-70">
            Smarter access to government benefits.
          </p>
        </div>
      </footer>
    </div>
  );
}