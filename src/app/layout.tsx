import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "EWC Model Portfolio",
  description:
    "Hypothetical performance based on posted closed trade signals. Public-facing EWC performance dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
