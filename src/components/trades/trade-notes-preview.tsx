import type { CSSProperties } from "react";

import { truncateText } from "@/lib/utils";

const clampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export function TradeNotesPreview({
  notes,
  compact = false,
  className,
}: {
  notes: string | null;
  compact?: boolean;
  className?: string;
}) {
  const preview = truncateText(notes, compact ? 68 : 120);

  if (!preview) {
    return <span className={className}>No notes</span>;
  }

  return (
    <span className={className} style={clampStyle} title={notes ?? undefined}>
      {preview}
    </span>
  );
}
