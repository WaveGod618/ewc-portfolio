import type { AssetType, TradeDirection, TradeStatus } from "@/lib/types";

export const DEFAULT_DISCLAIMER =
  "Performance shown is based on posted EWC trade alerts and their tracked outcomes. This page reflects the published signal record and does not represent audited brokerage or client account statements. Real-world execution, slippage, commissions, and fills may vary.";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "Closed Trades" },
];

export const TRADE_DIRECTIONS: TradeDirection[] = ["long", "short"];
export const ASSET_TYPES: AssetType[] = ["stock", "futures", "crypto", "other"];
export const TRADE_STATUSES: TradeStatus[] = ["open", "closed", "stopped", "partial", "cancelled"];
export const EDITABLE_TRADE_STATUSES: TradeStatus[] = ["open", "partial", "cancelled"];
export const FINAL_TRADE_STATUSES: TradeStatus[] = ["closed", "stopped", "partial"];

export const OUTCOME_LABELS = [
  "target hit",
  "stopped out",
  "manual close",
  "partial win",
  "break even",
];

export const SOURCE_LABELS = ["Discord", "Weekly Projections", "Swing Signal"];
