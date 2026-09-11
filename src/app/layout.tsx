import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scheme Sathi",
  description: "A simple starting point for discovering government schemes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
