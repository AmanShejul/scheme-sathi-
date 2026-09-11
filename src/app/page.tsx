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
    description:
      "Discover government benefits matched to your profile.",
    icon: Search,
  },
  {
    title: "Check eligibility",
    description:
      "See why a scheme may or may not fit your profile.",
    icon: ClipboardCheck,
  },
  {
    title: "Find compatible benefits",
    description:
      "Identify schemes that can work together.",
    icon: ShieldCheck,
  },
  {
    title: "Know your next steps",
    description:
      "Get documents and application actions in one place.",
    icon: FileCheck2,
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes scheme-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scheme-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scheme-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(234, 88, 12, 0);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(234, 88, 12, 0.07);
          }
        }

        @keyframes scheme-line {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .scheme-fade-up {
          animation: scheme-fade-up 0.7s ease-out both;
        }

        .scheme-fade-in {
          animation: scheme-fade-in 0.8s ease-out both;
        }

        .scheme-pulse {
          animation: scheme-pulse 3s ease-in-out infinite;
        }

        .scheme-line {
          animation: scheme-line 0.9s ease-out 0.3s both;
        }

        .scheme-step {
          opacity: 0;
          animation: scheme-fade-up 0.65s ease-out forwards;
        }

        .scheme-feature {
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease;
        }

        .scheme-feature:hover {
          transform: translateY(-5px);
          border-color: rgba(234, 88, 12, 0.35);
          background-color: rgba(255, 250, 246, 0.7);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.05);
        }

        .scheme-step-card {
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease;
        }

        .scheme-step-card:hover {
          transform: translateY(-4px);
          background-color: rgba(255, 250, 246, 0.6);
        }

        .scheme-arrow {
          transition:
            transform 220ms ease,
            opacity 220ms ease;
        }

        .scheme-step-card:hover .scheme-arrow {
          transform: translateX(4px);
          opacity: 1;
        }

        .scheme-cta {
          transition:
            transform 220ms ease,
            box-shadow 220ms ease;
        }

        .scheme-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <main>
          {/* HERO */}
          <section className="relative overflow-hidden border-b border-border bg-[#fffaf6]">
            <div className="absolute inset-x-0 bottom-0 h-px bg-primary/20 scheme-line" />

            <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
              <div className="max-w-4xl">
                <div
                  className="scheme-fade-up mb-6 inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground scheme-pulse"
                  style={{ animationDelay: "0.05s" }}
                >
                  <CheckCircle2
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  Smarter access to government benefits
                </div>

                <p
                  className="scheme-fade-up text-base font-bold tracking-wide text-primary"
                  style={{ animationDelay: "0.12s" }}
                >
                  Government benefits, simplified.
                </p>

                <h1
                  className="scheme-fade-up mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ animationDelay: "0.2s" }}
                >
                  Find the government benefits you may be eligible for.
                </h1>

                <p
                  className="scheme-fade-up mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl"
                  style={{ animationDelay: "0.3s" }}
                >
                  Scheme Sathi helps you identify relevant schemes, understand
                  eligibility, find compatible benefits, and plan your next
                  steps.
                </p>

                <div
                  className="scheme-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-6 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Link href="/find-benefits">
                      Check My Benefits
                      <ArrowRight
                        className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[#fffaf6]"
                  >
                    <Link href="#how-it-works">How it works</Link>
                  </Button>
                </div>

                <p
                  className="scheme-fade-up mt-5 text-sm text-muted-foreground"
                  style={{ animationDelay: "0.5s" }}
                >
                  Eligibility results are indicative. Final eligibility is
                  confirmed by the official authority.
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
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
                  From your profile to an actionable application plan, all in
                  one guided flow.
                </p>
              </div>

              <div className="mt-10 grid gap-0 border-y border-border sm:grid-cols-2 lg:grid-cols-5">
                {steps.map(
                  ({ number, label, description, icon: Icon }, index) => (
                    <div
                      key={number}
                      className={[
                        "scheme-step scheme-step-card relative min-h-[190px] p-6",
                        index > 0
                          ? "border-t border-border lg:border-l lg:border-t-0"
                          : "",
                      ].join(" ")}
                      style={{
                        animationDelay: `${0.12 + index * 0.1}s`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Icon
                          className="size-5 shrink-0 text-primary transition-transform duration-200 group-hover:scale-110"
                          aria-hidden="true"
                        />

                        <span className="text-sm font-bold text-muted-foreground">
                          {number}
                        </span>
                      </div>

                      <div className="mt-12 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{label}</h3>

                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {description}
                          </p>
                        </div>

                        <ArrowRight
                          className="scheme-arrow mt-1 size-4 shrink-0 text-primary opacity-40"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="border-y border-border bg-muted/30">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
              <div className="max-w-2xl scheme-fade-up">
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
                      "scheme-feature min-h-[220px] border-border p-6",
                      index > 0
                        ? "border-t sm:border-l sm:border-t-0"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between">
                      <Icon
                        className="size-5 text-primary transition-transform duration-200 hover:scale-110"
                        aria-hidden="true"
                      />

                      <span className="text-xs font-semibold text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-7 font-bold">{title}</h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="scheme-cta mt-10 flex flex-col gap-4 border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="font-bold">
                    Ready to check your benefits?
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Start with a few details about yourself.
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="shrink-0 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Link href="/find-benefits">
                    Check My Benefits
                    <ArrowRight
                      className="ml-2 size-4"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
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
    </>
  );
}