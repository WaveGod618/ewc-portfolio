import { cache } from "react";

import {
  publicClosedTradeOverrides,
  sampleSettings,
  sampleSnapshots,
  sampleTrades,
} from "@/lib/sample-data";
import { getPublicBenchmarkSummary } from "@/lib/benchmark-config";
import {
  calculatePerformanceStats,
  calculateTradeOutcome,
  isTradeClosed,
  isTradeOpen,
} from "@/lib/trade-math";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  AdminModelData,
  EquitySnapshotRow,
  PublicModelData,
  SettingsRow,
  TradeRow,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/utils";

function resolveSortTime(value: string | null | undefined, fallback?: string | null | undefined) {
  const candidates = [value, fallback];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const yearMatch = candidate.match(/\b(19|20)\d{2}\b/);

    if (yearMatch) {
      return Date.UTC(Number(yearMatch[0]), 0, 1, 0, 0, 0, 0);
    }

    const parsed = new Date(candidate).getTime();

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function sortTradesDescending(trades: TradeRow[], field: "opened_at" | "closed_at") {
  return [...trades].sort(
    (left, right) =>
      resolveSortTime(right[field], right.created_at) -
      resolveSortTime(left[field], left.created_at),
  );
}

function matchesOverride(trade: TradeRow, override: (typeof publicClosedTradeOverrides)[number]) {
  return (
    trade.ticker.toUpperCase() === override.ticker &&
    trade.direction === override.direction &&
    Math.abs(trade.entry_price - override.entry_price) < 0.0001 &&
    Math.abs((trade.exit_price ?? 0) - override.exit_price) < 0.0001
  );
}

function toConfirmedPublicClosedTrade(
  override: (typeof publicClosedTradeOverrides)[number],
  trade: TradeRow | undefined,
  settings: SettingsRow,
): TradeRow {
  const outcome = calculateTradeOutcome({
    direction: override.direction,
    entryPrice: override.entry_price,
    stopPrice: trade?.stop_price ?? override.stop_price,
    exitPrice: override.exit_price,
    positionSizePct: trade?.position_size_pct ?? null,
    positionSizeDollars: trade?.position_size_dollars ?? override.position_size_dollars,
    startingCapital: settings.starting_capital,
  });

  return {
    id: trade?.id ?? `public-${override.ticker.toLowerCase()}`,
    ticker: override.ticker,
    direction: override.direction,
    asset_type: trade?.asset_type ?? override.asset_type,
    entry_price: override.entry_price,
    stop_price: override.stop_price,
    target_1: override.target_1,
    target_2: override.target_2 ?? null,
    target_3: override.target_3 ?? null,
    position_size_pct: trade?.position_size_pct ?? null,
    position_size_dollars: override.position_size_dollars,
    status: "closed",
    opened_at: override.opened_at ?? null,
    closed_at: override.closed_at,
    exit_price: override.exit_price,
    notes: override.notes,
    chart_image_url: trade?.chart_image_url ?? null,
    source_label: override.source_label,
    source_link: trade?.source_link ?? null,
    pnl_dollars: outcome.pnlDollars,
    pnl_percent: outcome.pnlPercent,
    r_multiple: outcome.rMultiple,
    outcome_label: override.outcome_label,
    created_at: trade?.created_at ?? settings.created_at,
    updated_at: trade?.updated_at ?? settings.updated_at,
  };
}

function buildModelData(input: {
  settings: SettingsRow;
  trades: TradeRow[];
  snapshots: EquitySnapshotRow[];
  previewMode: boolean;
  publicView?: boolean;
}): PublicModelData {
  const benchmark = getPublicBenchmarkSummary();
  const openTrades = input.publicView
    ? []
    : sortTradesDescending(input.trades.filter(isTradeOpen), "opened_at");
  const closedTrades = input.publicView
    ? sortTradesDescending(
        publicClosedTradeOverrides.map((override) =>
          toConfirmedPublicClosedTrade(
            override,
            input.trades.find(
              (trade) => isTradeClosed(trade) && matchesOverride(trade, override),
            ),
            input.settings,
          ),
        ),
        "closed_at",
      )
    : sortTradesDescending(input.trades.filter(isTradeClosed), "closed_at");
  const snapshots = input.publicView ? [] : input.snapshots;
  const { stats, equityCurve } = calculatePerformanceStats({
    settings: input.settings,
    openTrades,
    closedTrades,
    snapshots,
    benchmark,
  });

  return {
    settings: input.settings,
    openTrades,
    closedTrades,
    latestClosedTrades: closedTrades.slice(0, 6),
    latestOpenTrades: openTrades.slice(0, 4),
    stats,
    equityCurve,
    snapshots,
    previewMode: input.previewMode,
  };
}

async function getModelSource() {
  if (!isSupabaseConfigured()) {
    return {
      settings: sampleSettings,
      trades: sampleTrades,
      snapshots: sampleSnapshots,
      previewMode: true,
    };
  }

  const supabase = await createServerSupabaseClient();
  const [settingsResponse, tradesResponse, snapshotsResponse] = await Promise.all([
    supabase
      .from("settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("trades").select("*").order("opened_at", { ascending: false }),
    supabase
      .from("equity_snapshots")
      .select("*")
      .order("snapshot_date", { ascending: true }),
  ]);

  if (settingsResponse.error) {
    throw new Error(settingsResponse.error.message);
  }

  if (tradesResponse.error) {
    throw new Error(tradesResponse.error.message);
  }

  if (snapshotsResponse.error) {
    throw new Error(snapshotsResponse.error.message);
  }

  return {
    settings: (settingsResponse.data as SettingsRow | null) ?? sampleSettings,
    trades: (tradesResponse.data as TradeRow[]) ?? [],
    snapshots: snapshotsResponse.data ?? [],
    previewMode: false,
  };
}

export const getPublicModelData = cache(async (): Promise<PublicModelData> => {
  const source = await getModelSource();

  return buildModelData({
    ...source,
    publicView: true,
  });
});

export async function getAdminModelData(input: {
  editTradeId?: string;
  closeTradeId?: string;
}): Promise<AdminModelData> {
  const source = await getModelSource();
  const data = buildModelData(source);

  return {
    ...data,
    selectedTrade:
      data.openTrades.find((trade) => trade.id === input.editTradeId) ??
      data.closedTrades.find((trade) => trade.id === input.editTradeId) ??
      null,
    closeTrade:
      data.openTrades.find((trade) => trade.id === input.closeTradeId) ?? null,
  };
}
