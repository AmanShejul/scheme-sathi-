import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Flag,
  ListChecks,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    label: "Profile",
    description: "Tell us about yourself",
    icon: UserRound,
  },
  {
    number: "02",
    label: "Eligibility",
    description: "Check schemes you may qualify for",
    icon: ClipboardCheck,
  },
  {
    number: "03",
    label: "Conflicts",
    description: "Identify incompatible benefits",
    icon: ShieldCheck,
  },
  {
    number: "04",
    label: "Recommended Bundle",
    description: "Find the best combination",
    icon: ListChecks,
  },
  {
    number: "05",
    label: "Application Plan",
    description: "Know what to do next",
    icon: Flag,
  },
];

const features = [
  {
    title: "Find relevant schemes",
    description: "Discover government benefits matched to your profile.",
    icon: Search,
  },
  {
    title: "Check eligibility",
    description: "See why a scheme may or may not fit your profile.",
    icon: ClipboardCheck,
  },
  {
    title: "Find compatible benefits",
    description: "Identify schemes that can work together.",
    icon: ShieldCheck,
  },
  {
    title: "Know your next steps",
    description: "Get documents and application actions in one place.",
    icon: FileCheck2,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-[#fffaf6]">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground">
                <CheckCircle2
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Smarter access to government benefits
              </div>

              <p className="text-base font-bold tracking-wide text-primary">
                Government benefits, simplified.
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Find the government benefits you may be eligible for.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Scheme Sathi helps you identify relevant schemes, understand
                eligibility, find compatible benefits, and plan your next
                steps.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6">
                  <Link href="/find-benefits">
                    Check My Benefits
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6"
                >
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Eligibility results are indicative. Final eligibility is
                confirmed by the official authority.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
        >
          <div className="border-t border-border pt-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary">
                  Simple process
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  How it works
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-right">
                From your profile to an actionable application plan, all in one
                guided flow.
              </p>
            </div>

            <div className="mt-10 grid gap-0 border-y border-border sm:grid-cols-2 lg:grid-cols-5">
              {steps.map(
                ({ number, label, description, icon: Icon }, index) => (
                  <div
                    key={number}
                    className={[
                      "relative min-h-[180px] p-6",
                      index > 0 ? "border-t border-border lg:border-l lg:border-t-0" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Icon
                        className="size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-bold text-muted-foreground">
                        {number}
                      </span>
                    </div>

                    <h3 className="mt-12 font-bold">{label}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary">
                What Scheme Sathi does
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Everything you need to plan your benefits journey.
              </h2>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Instead of searching through schemes one by one, Scheme Sathi
                organizes the information around your profile and next action.
              </p>
            </div>

            <div className="mt-10 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, description, icon: Icon }, index) => (
                <div
                  key={title}
                  className={[
                    "min-h-[210px] p-6",
                    index > 0
                      ? "border-t border-border sm:border-l sm:border-t-0"
                      : "",
                    index === 2
                      ? "lg:border-l"
                      : "",
                  ].join(" ")}
                >
                  <Icon
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />

                  <h3 className="mt-6 font-bold">{title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">Ready to check your benefits?</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with a few details about yourself.
                </p>
              </div>

              <Button asChild size="lg" className="shrink-0">
                <Link href="/find-benefits">
                  Check My Benefits
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:px-10 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <div>
            <p className="font-bold">Scheme Sathi</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Smarter access to government benefits.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Government benefit discovery assistant
          </p>
        </div>
      </footer>
    </div>
  );
}