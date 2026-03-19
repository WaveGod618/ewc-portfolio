import { DEFAULT_DISCLAIMER } from "@/lib/constants";
import { calculateTradeOutcome } from "@/lib/trade-math";
import type { EquitySnapshotRow, SettingsRow, TradeRow } from "@/lib/types";

const now = "2026-03-12T10:00:00.000Z";
const startingCapital = 100_000;

const createClosedTrade = (
  trade: Omit<TradeRow, "pnl_percent" | "pnl_dollars" | "r_multiple">,
): TradeRow => {
  const outcome = calculateTradeOutcome({
    direction: trade.direction,
    entryPrice: trade.entry_price,
    stopPrice: trade.stop_price,
    exitPrice: trade.exit_price ?? trade.entry_price,
    positionSizePct: trade.position_size_pct,
    positionSizeDollars: trade.position_size_dollars,
    startingCapital,
  });

  return {
    ...trade,
    pnl_percent: outcome.pnlPercent,
    pnl_dollars: outcome.pnlDollars,
    r_multiple: outcome.rMultiple,
  };
};

export const sampleSettings: SettingsRow = {
  id: "00000000-0000-0000-0000-000000000001",
  starting_capital: startingCapital,
  portfolio_name: "EWC Model Portfolio",
  disclaimer_text: DEFAULT_DISCLAIMER,
  created_at: now,
  updated_at: now,
};

export const sampleTrades: TradeRow[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    ticker: "TSLA",
    direction: "short",
    asset_type: "stock",
    entry_price: 438.5,
    stop_price: 460,
    target_1: 400,
    target_2: 382,
    target_3: 360,
    position_size_pct: 12,
    position_size_dollars: null,
    status: "open",
    opened_at: "2026-03-07T14:30:00.000Z",
    closed_at: null,
    exit_price: null,
    notes: "TSLA swept the prior level and remains structurally weak.",
    chart_image_url: null,
    source_label: "Discord",
    source_link: null,
    pnl_dollars: null,
    pnl_percent: null,
    r_multiple: null,
    outcome_label: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    ticker: "AAPL",
    direction: "short",
    asset_type: "stock",
    entry_price: 260.81,
    stop_price: 280,
    target_1: 236,
    target_2: 226,
    target_3: null,
    position_size_pct: 10,
    position_size_dollars: null,
    status: "open",
    opened_at: "2026-03-06T15:15:00.000Z",
    closed_at: null,
    exit_price: null,
    notes: "Failed reclaim at resistance with broad market weakness.",
    chart_image_url: null,
    source_label: "Discord",
    source_link: null,
    pnl_dollars: null,
    pnl_percent: null,
    r_multiple: null,
    outcome_label: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    ticker: "AMD",
    direction: "short",
    asset_type: "stock",
    entry_price: 207.08,
    stop_price: 226,
    target_1: 181.5,
    target_2: 173,
    target_3: null,
    position_size_pct: 10,
    position_size_dollars: null,
    status: "open",
    opened_at: "2026-03-05T18:00:00.000Z",
    closed_at: null,
    exit_price: null,
    notes: "Relative weakness remains intact after the supply retest.",
    chart_image_url: null,
    source_label: "Discord",
    source_link: null,
    pnl_dollars: null,
    pnl_percent: null,
    r_multiple: null,
    outcome_label: null,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000104",
    ticker: "NVDA",
    direction: "short",
    asset_type: "stock",
    entry_price: 180.9,
    stop_price: 197,
    target_1: 161,
    target_2: 157,
    target_3: null,
    position_size_pct: 10,
    position_size_dollars: null,
    status: "open",
    opened_at: "2026-03-04T16:20:00.000Z",
    closed_at: null,
    exit_price: null,
    notes: "Momentum failed at the retest and the setup still favors downside continuation.",
    chart_image_url: null,
    source_label: "Discord",
    source_link: null,
    pnl_dollars: null,
    pnl_percent: null,
    r_multiple: null,
    outcome_label: null,
    created_at: now,
    updated_at: now,
  },
  createClosedTrade({
    id: "00000000-0000-0000-0000-000000000201",
    ticker: "RGTI",
    direction: "short",
    asset_type: "stock",
    entry_price: 35.6,
    stop_price: 44.52,
    target_1: 21.5,
    target_2: null,
    target_3: null,
    position_size_pct: null,
    position_size_dollars: 10_000,
    status: "closed",
    opened_at: "2025-11-05",
    closed_at: "2026-01-29",
    exit_price: 20.32,
    notes:
      "Trade was opened in 2025 and closed in 2026. It should be included in 2026 YTD performance because it was closed in 2026.",
    chart_image_url: null,
    source_label: "Discord",
    source_link: null,
    outcome_label: "target hit",
    created_at: now,
    updated_at: now,
  }),
  createClosedTrade({
    id: "00000000-0000-0000-0000-000000000202",
    ticker: "AMZN",
    direction: "short",
    asset_type: "stock",
    entry_price: 238.7,
    stop_price: 250,
    target_1: 215,
    target_2: 209,
    target_3: 205,
    position_size_pct: null,
    position_size_dollars: 10_000,
    status: "closed",
    opened_at: "2026-02-03",
    closed_at: "2026-02-12",
    exit_price: 199.87,
    notes:
      "Closed in 2026 and should be included in 2026 YTD performance.",
    chart_image_url: null,
    source_label: "Discord",
    source_link: null,
    outcome_label: "target hit",
    created_at: now,
    updated_at: now,
  }),
];

export const sampleSnapshots: EquitySnapshotRow[] = [];

type PublicClosedTradeOverride = {
  ticker: string;
  direction: TradeRow["direction"];
  asset_type: TradeRow["asset_type"];
  entry_price: number;
  stop_price: number;
  target_1: number | null;
  target_2?: number | null;
  target_3?: number | null;
  exit_price: number;
  position_size_dollars: number;
  opened_at?: string | null;
  closed_at: string;
  source_label: string;
  notes: string;
  outcome_label: string;
};

export const publicClosedTradeOverrides: PublicClosedTradeOverride[] = [
  {
    ticker: "RGTI",
    direction: "short",
    asset_type: "stock",
    entry_price: 35.6,
    stop_price: 44.52,
    target_1: 21.5,
    target_2: null,
    target_3: null,
    exit_price: 20.32,
    position_size_dollars: 10_000,
    opened_at: "2025-11-05",
    closed_at: "2026-01-29",
    source_label: "Discord",
    notes:
      "Trade was opened in 2025 and closed in 2026. It should be included in 2026 YTD performance because it was closed in 2026.",
    outcome_label: "target hit",
  },
  {
    ticker: "AMZN",
    direction: "short",
    asset_type: "stock",
    entry_price: 238.7,
    stop_price: 250,
    target_1: 215,
    target_2: 209,
    target_3: 205,
    exit_price: 199.87,
    position_size_dollars: 10_000,
    opened_at: "2026-02-03",
    closed_at: "2026-02-12",
    source_label: "Discord",
    notes: "Closed in 2026 and should be included in 2026 YTD performance.",
    outcome_label: "target hit",
  },
  {
    ticker: "TSLA",
    direction: "short",
    asset_type: "stock",
    entry_price: 438.5,
    stop_price: 499,
    target_1: 382,
    target_2: null,
    target_3: null,
    exit_price: 382.25,
    position_size_dollars: 10_000,
    opened_at: "2026-01-06T14:48:00.000Z",
    closed_at: "2026-03-19",
    source_label: "Discord",
    notes: "Closed in 2026 and should be included in 2026 YTD performance.",
    outcome_label: "target hit",
  },
];
