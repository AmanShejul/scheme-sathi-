import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Scheme Sathi",
    template: "%s | Scheme Sathi",
  },
  description:
    "A smarter and simpler way to discover government schemes and benefits relevant to you.",
  applicationName: "Scheme Sathi",
  keywords: [
    "government schemes",
    "government benefits",
    "scheme eligibility",
    "benefits finder",
    "Scheme Sathi",
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background font-serif text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          {/* Global background accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-[-1] h-[28rem] bg-muted/30"
          />

          {/* Main application shell */}
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}