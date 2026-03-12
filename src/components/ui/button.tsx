import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
    size === "sm" && "h-8 px-3.5 text-xs",
    size === "md" && "h-9 px-4",
    size === "lg" && "h-10 px-5 text-sm",
    variant === "primary" &&
      "border-white/15 bg-white text-slate-950 shadow-[0_12px_36px_rgba(255,255,255,0.12)] hover:bg-white/90",
    variant === "secondary" &&
      "border-white/10 bg-white/[0.04] text-foreground hover:bg-white/[0.08]",
    variant === "ghost" &&
      "border-transparent bg-transparent text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
    variant === "danger" &&
      "border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20",
    className,
  );
}

export function Button({
  children,
  className,
  variant,
  size,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
