import {
  ArrowRight,
  CheckCircle2,
  Info,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { CitizenProfileForm } from "@/components/profile/citizen-profile-form";

const trustPoints = [
  {
    icon: LockKeyhole,
    title: "Your information",
    description:
      "Used only to evaluate the benefit criteria in this flow.",
  },
  {
    icon: ShieldCheck,
    title: "Rule-based evaluation",
    description:
      "Results are based on the information you provide.",
  },
  {
    icon: Info,
    title: "About your result",
    description:
      "Results are indicative and should be confirmed officially.",
  },
];

export default function FindBenefitsPage() {
  return (
    <>
      <style>{`
        @keyframes ss-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ss-fade-right {
          from {
            opacity: 0;
            transform: translateX(-14px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes ss-line-reveal {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .ss-fade-up {
          animation: ss-fade-up 0.65s ease-out both;
        }

        .ss-fade-right {
          animation: ss-fade-right 0.65s ease-out both;
        }

        .ss-line-reveal {
          animation: ss-line-reveal 0.8s ease-out 0.2s both;
        }

        .ss-info-card {
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease;
        }

        .ss-info-card:hover {
          transform: translateY(-3px);
          border-color: rgba(234, 88, 12, 0.25);
          background-color: #fffaf6;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }

        .ss-form-shell {
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease;
        }

        .ss-form-shell:hover {
          border-color: rgba(234, 88, 12, 0.18);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.045);
        }

        .ss-icon-box {
          transition:
            transform 220ms ease,
            background-color 220ms ease;
        }

        .ss-info-card:hover .ss-icon-box {
          transform: scale(1.05);
          background-color: #fffaf6;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden bg-[#faf9f7] text-foreground">
        <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
          {/* Page heading */}
          <section className="ss-fade-up">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm font-semibold text-muted-foreground">
                <ShieldCheck
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Secure profile setup
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
                Find benefits
              </p>

              <h1 className="mt-3 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Tell us about yourself.
              </h1>

              <div className="relative mt-5 max-w-2xl overflow-hidden">
                <div
                  className="ss-line-reveal absolute bottom-0 left-0 h-full w-full bg-[#faf9f7]"
                  aria-hidden="true"
                />

                <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Answer a few questions about your profile so Scheme Sathi can
                  identify government benefits that may be relevant to you.
                </p>
              </div>
            </div>
          </section>

          {/* Trust cards */}
          <section className="mt-9 grid border-y border-border bg-background sm:grid-cols-3">
            {trustPoints.map(
              ({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className={[
                    "ss-info-card ss-fade-up p-5 sm:p-6",
                    index > 0
                      ? "border-t border-border sm:border-l sm:border-t-0"
                      : "",
                  ].join(" ")}
                  style={{
                    animationDelay: `${0.12 + index * 0.09}s`,
                  }}
                >
                  <div className="ss-icon-box flex size-9 items-center justify-center border border-border bg-[#faf9f7]">
                    <Icon
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-4 text-sm font-bold">{title}</p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ),
            )}
          </section>

          {/* Main content */}
          <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* Form */}
            <div
              className="ss-form-shell ss-fade-up overflow-hidden border border-border bg-background shadow-[0_10px_35px_rgba(0,0,0,0.035)]"
              style={{ animationDelay: "0.38s" }}
            >
              <div className="relative border-b border-border bg-[#fffaf6] px-6 py-6 sm:px-8">
                <div className="absolute inset-x-0 bottom-0 h-px bg-primary/20" />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      Citizen profile
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Enter your details
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Complete each step to continue.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <CheckCircle2
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    Takes a few minutes
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <CitizenProfileForm />
              </div>
            </div>

            {/* Right information panel */}
            <aside
              className="ss-fade-right border border-border bg-[#fffaf6] p-6 lg:sticky lg:top-24"
              style={{ animationDelay: "0.48s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center border border-border bg-background">
                  <Info
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm font-bold">Before you continue</p>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-sm font-semibold">
                    Keep your information accurate
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The assessment depends on the information you provide.
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-sm font-semibold">
                    Keep your documents ready
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    You will later be asked which documents you currently have.
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="text-sm font-semibold">
                    Review before analysis
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    You can review the information before starting your benefit
                    assessment.
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Next
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  Complete your profile
                  <ArrowRight
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </aside>
          </section>

          {/* Disclaimer */}
          <p
            className="ss-fade-up mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-muted-foreground"
            style={{ animationDelay: "0.55s" }}
          >
            Scheme Sathi provides an indicative assessment based on the
            information provided. Final eligibility is determined by the
            concerned government authority.
          </p>
        </main>
      </div>
    </>
  );
}