"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TradeRow } from "@/lib/types";

function escapeCsv(value: string | number | null) {
  const stringValue = value === null ? "" : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export function ExportCsvButton({ trades }: { trades: TradeRow[] }) {
  const handleClick = () => {
    const rows = [
      [
        "Ticker",
        "Direction",
        "Entry",
        "Exit",
        "Stop",
        "PnL %",
        "R Multiple",
        "Outcome",
        "Opened At",
        "Closed At",
        "Source",
        "Notes",
      ],
      ...trades.map((trade) => [
        trade.ticker,
        trade.direction,
        trade.entry_price,
        trade.exit_price,
        trade.stop_price,
        trade.pnl_percent,
        trade.r_multiple,
        trade.outcome_label,
        trade.opened_at,
        trade.closed_at,
        trade.source_label,
        trade.notes,
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ewc-model-portfolio-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleClick} type="button" variant="secondary">
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
