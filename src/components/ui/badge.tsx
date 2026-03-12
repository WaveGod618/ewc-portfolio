import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "positive" | "negative" | "warning" | "info";

export function Badge({
  children,
  variant = "default",
  className,
  ...props
}: PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    variant?: BadgeVariant;
  }
>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]",
        variant === "default" && "border-white/10 bg-white/[0.04] text-muted-foreground",
        variant === "positive" && "border-emerald-500/18 bg-emerald-500/10 text-emerald-300",
        variant === "negative" && "border-red-500/18 bg-red-500/10 text-red-300",
        variant === "warning" && "border-amber-500/18 bg-amber-500/10 text-amber-300",
        variant === "info" && "border-sky-500/18 bg-sky-500/10 text-sky-200",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
