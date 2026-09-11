"use client";

import Link from "next/link";
import { Landmark, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-6 sm:gap-6 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <span className="flex size-8 items-center justify-center rounded-sm text-primary">
            <Landmark className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-none">Scheme Sathi</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-bold text-muted-foreground sm:flex">
          <Link className={`border-b-2 py-2 transition-colors hover:text-primary ${isActive("/") ? "border-primary text-primary" : "border-transparent"}`} href="/">
            Home
          </Link>
          <Link className={`border-b-2 py-2 transition-colors hover:text-primary ${isActive("/find-benefits") ? "border-primary text-primary" : "border-transparent"}`} href="/find-benefits">
            Find Benefits
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="shrink-0 sm:h-10 sm:px-4">
          <Link href="/find-benefits">Check My Benefits</Link>
          </Button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-sm border border-border text-foreground sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-border px-6 py-3 sm:hidden">
          <Link className={`block border-b py-3 text-sm font-bold ${isActive("/") ? "border-primary text-primary" : "border-border text-muted-foreground"}`} href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link className={`block border-b py-3 text-sm font-bold ${isActive("/find-benefits") ? "border-primary text-primary" : "border-border text-muted-foreground"}`} href="/find-benefits" onClick={() => setMenuOpen(false)}>
            Find Benefits
          </Link>
        </nav>
      )}
    </header>
  );
}