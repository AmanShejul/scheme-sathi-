import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

import { SiteHeader } from "@/components/layout/site-header";
import { SchemeSathiProvider } from "@/frontend/context/SchemeSathiContext";

export const metadata: Metadata = {
  title: "Scheme Sathi",
  description: "A simple starting point for discovering government schemes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <SchemeSathiProvider>
          <SiteHeader />
          {children}
        </SchemeSathiProvider>
      </body>
    </html>
  );
}
