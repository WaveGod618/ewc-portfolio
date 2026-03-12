export type TradeDirection = "long" | "short";
export type AssetType = "stock" | "futures" | "crypto" | "other";
export type TradeStatus = "open" | "closed" | "stopped" | "partial" | "cancelled";

export interface SettingsRow {
  id: string;
  starting_capital: number;
  portfolio_name: string;
  disclaimer_text: string;
  created_at: string;
  updated_at: string;
}

export interface TradeRow {
  id: string;
  ticker: string;
  direction: TradeDirection;
  asset_type: AssetType;
  entry_price: number;
  stop_price: number;
  target_1: number | null;
  target_2: number | null;
  target_3: number | null;
  position_size_pct: number | null;
  position_size_dollars?: number | null;
  status: TradeStatus;
  opened_at: string | null;
  closed_at: string | null;
  exit_price: number | null;
  notes: string | null;
  chart_image_url: string | null;
  source_label: string | null;
  source_link: string | null;
  pnl_dollars: number | null;
  pnl_percent: number | null;
  r_multiple: number | null;
  outcome_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquitySnapshotRow {
  id: string;
  snapshot_date: string;
  equity_value: number;
  note: string | null;
  created_at: string;
}

export interface EquityPoint {
  label: string;
  date: string;
  equity: number;
}

export interface BenchmarkComparison {
  label: string;
  benchmarkReturnPct: number;
  relativePerformancePct: number;
}

export interface PerformanceStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number;
  averageR: number | null;
  ytdReturnPct: number;
  totalReturnPct: number;
  currentEquity: number;
  spxComparison: BenchmarkComparison;
  bestTrade: TradeRow | null;
  worstTrade: TradeRow | null;
}

export interface PublicModelData {
  settings: SettingsRow;
  openTrades: TradeRow[];
  closedTrades: TradeRow[];
  latestClosedTrades: TradeRow[];
  latestOpenTrades: TradeRow[];
  stats: PerformanceStats;
  equityCurve: EquityPoint[];
  snapshots: EquitySnapshotRow[];
  previewMode: boolean;
}

export interface AdminModelData extends PublicModelData {
  selectedTrade: TradeRow | null;
  closeTrade: TradeRow | null;
}

export interface ActionState {
  success?: string;
  error?: string;
}
