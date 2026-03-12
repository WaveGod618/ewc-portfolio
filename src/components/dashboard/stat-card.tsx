import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  note,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  note?: string;
  accent?: "neutral" | "positive" | "negative" | "info";
  icon?: LucideIcon;
}) {
  const valueClassName =
    value.length > 12
      ? "text-[clamp(1.45rem,2vw,1.85rem)]"
      : value.length > 10
        ? "text-[clamp(1.55rem,2.15vw,1.95rem)]"
        : "text-[clamp(1.7rem,2.4vw,2.1rem)]";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-3 max-w-full font-semibold leading-[0.95] tracking-[-0.04em] text-foreground",
              valueClassName,
              accent === "positive" && "text-emerald-300",
              accent === "negative" && "text-red-300",
              accent === "info" && "text-sky-200",
            )}
          >
            {value}
          </p>
          {note ? (
            <p className="mt-2 text-[13px] leading-5 text-muted-foreground">{note}</p>
          ) : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border",
              accent === "positive" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
              accent === "negative" && "border-red-500/20 bg-red-500/10 text-red-300",
              accent === "info" && "border-sky-500/20 bg-sky-500/10 text-sky-200",
              (!accent || accent === "neutral") && "border-white/10 bg-white/[0.05] text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        ) : (
          <span
            className={cn(
              "mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-white/25",
              accent === "positive" && "bg-emerald-300",
              accent === "negative" && "bg-red-300",
              accent === "info" && "bg-sky-200",
            )}
          />
        )}
      </div>
    </Card>
  );
}
