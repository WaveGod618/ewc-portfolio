import { Card } from "@/components/ui/card";

export function DisclaimerCard({ text }: { text: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <div className="max-w-4xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Signal record disclosure
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
      </div>
    </Card>
  );
}
