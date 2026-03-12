import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-sky-400/60 focus:bg-white/8",
        className,
      )}
      {...props}
    />
  );
}
