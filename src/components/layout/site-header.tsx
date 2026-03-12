"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonStyles } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-background/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sky-200">
              <span className="font-heading text-[11px] tracking-[0.28em]">EWC</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Public performance dashboard
              </p>
              <p className="text-sm font-medium tracking-[0.02em] text-foreground">
                EWC Model Portfolio
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                className={cn(
                  buttonStyles({
                    variant: active ? "secondary" : "ghost",
                    size: "sm",
                    className: "rounded-full",
                  }),
                  active && "border-white/10 bg-white/[0.06] text-foreground shadow-none",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
