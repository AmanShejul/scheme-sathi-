import { ArrowRight, Search } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section id="about" className="border-b border-border bg-[#fffaf6]">
          <div className="mx-auto flex min-h-[30rem] w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-primary">
              Government services, made simpler
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Find schemes that can help you move forward.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Scheme Sathi will help people discover public benefits and understand where to begin.
            </p>
            <div className="mt-9">
              <Button size="lg" className="gap-2">
                <Search className="size-4" aria-hidden="true" />
                Explore schemes
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <section id="help" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid gap-10 border-t border-border pt-8 md:grid-cols-3">
            <div>
              <h2 className="text-xl font-bold text-foreground">Clear information</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Understand the purpose, support, and next steps for each service.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Built for everyone</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                A calm, accessible starting point for citizens and families.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">A trusted starting point</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Designed to make public services easier to navigate and compare.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
