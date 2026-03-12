import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-foreground outline-none transition focus:border-sky-400/60 focus:bg-white/8",
        className,
      )}
      {...props}
    />
  );
}
