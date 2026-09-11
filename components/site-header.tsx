import Link from "next/link";
import { Landmark } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-6 px-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <span className="flex size-10 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <Landmark className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-xl font-bold leading-none">Scheme Sathi</span>
            <span className="mt-1 block text-xs text-muted-foreground">Your guide to government schemes</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-bold text-muted-foreground sm:flex">
          <Link className="transition-colors hover:text-foreground" href="#about">
            About
          </Link>
          <Link className="transition-colors hover:text-foreground" href="#help">
            Help
          </Link>
        </nav>
      </div>
    </header>
  );
}