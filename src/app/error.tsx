"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
      <Button className="mt-6" onClick={reset} type="button">
        Try again
      </Button>
    </Card>
  );
}
