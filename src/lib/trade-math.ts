import type {
  EquityPoint,
  EquitySnapshotRow,
  PerformanceStats,
  SettingsRow,
  TradeDirection,
  TradeRow,
} from "@/lib/types";

export function directionalMove(direction: TradeDirection, entry: number, reference: number) {
  return direction === "long" ? reference - entry : entry - reference;
}

export function calculateTradeOutcome(input: {
  direction: TradeDirection;
  entryPrice: number;
  stopPrice: number;
  exitPrice: number;
  positionSizePct?: number | null;
  positionSizeDollars?: number | null;
  startingCapital?: number;
}) {
  const directionalResult = directionalMove(
    input.direction,
    input.entryPrice,
    input.exitPrice,
  );
  const riskPerUnit = Math.abs(input.entryPrice - input.stopPrice);
  const pnlPercent =
    input.entryPrice === 0 ? null : (directionalResult / input.entryPrice) * 100;
  const rMultiple = riskPerUnit === 0 ? null : directionalResult / riskPerUnit;

  const hasDollarSizing =
    typeof input.positionSizePct === "number" &&
    input.positionSizePct > 0 &&
    typeof input.startingCapital === "number" &&
    input.startingCapital > 0 &&
    typeof pnlPercent === "number";

  const pnlDollars = hasDollarSizing
    ? input.startingCapital! * (input.positionSizePct! / 100) * (pnlPercent! / 100)
    : typeof input.positionSizeDollars === "number" &&
        input.positionSizeDollars > 0 &&
        typeof pnlPercent === "number"
      ? input.positionSizeDollars * (pnlPercent / 100)
      : null;

  return {
    pnlPercent,
    pnlDollars,
    rMultiple,
  };
}

export function isTradeOpen(trade: TradeRow) {
  return trade.status === "open" || (trade.status === "partial" && !trade.closed_at);
}

export function isTradeClosed(trade: TradeRow) {
  return !isTradeOpen(trade);
}

function resolveTradeTimeValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const yearMatch = value.match(/\b(19|20)\d{2}\b/);

  if (yearMatch) {
    return Date.UTC(Number(yearMatch[0]), 0, 1, 0, 0, 0, 0);
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

function getTradeResolvedTime(trade: TradeRow, prefer: "opened" | "closed") {
  const primary = prefer === "closed" ? trade.closed_at : trade.opened_at;
  const fallback = prefer === "closed" ? trade.opened_at : trade.closed_at;

  return (
    resolveTradeTimeValue(primary) ??
    resolveTradeTimeValue(fallback) ??
    resolveTradeTimeValue(trade.created_at) ??
    0
  );
}

function getTradeClosedYear(trade: TradeRow) {
  const resolved = resolveTradeTimeValue(trade.closed_at);

  if (resolved !== null) {
    return new Date(resolved).getUTCFullYear();
  }

  const yearMatch = trade.closed_at?.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? Number(yearMatch[0]) : null;
}

function buildSyntheticCurve(startingCapital: number, closedTrades: TradeRow[]) {
  const points: EquityPoint[] = [
    {
      label: "Start",
      date: "Start",
      equity: startingCapital,
    },
  ];

  let runningEquity = startingCapital;

  closedTrades
    .filter((trade) => typeof trade.pnl_dollars === "number")
    .sort((left, right) => getTradeResolvedTime(left, "closed") - getTradeResolvedTime(right, "closed"))
    .forEach((trade) => {
      runningEquity += trade.pnl_dollars ?? 0;
      const timelineLabel =
        trade.closed_at && /\d{4}-\d{2}-\d{2}/.test(trade.closed_at)
          ? trade.closed_at
          : `${trade.ticker} close`;

      points.push({
        label: trade.ticker,
        date: timelineLabel,
        equity: Number(runningEquity.toFixed(2)),
      });
    });

  return points;
}

export function buildEquityCurve(input: {
  startingCapital: number;
  snapshots: EquitySnapshotRow[];
  closedTrades: TradeRow[];
}) {
  const orderedSnapshots = [...input.snapshots].sort(
    (left, right) =>
      new Date(left.snapshot_date).getTime() - new Date(right.snapshot_date).getTime(),
  );

  if (orderedSnapshots.length === 0) {
    return buildSyntheticCurve(input.startingCapital, input.closedTrades);
  }

  const firstSnapshot = orderedSnapshots[0];
  const firstSnapshotTime = new Date(firstSnapshot.snapshot_date).getTime();

  const points: EquityPoint[] = [
    {
      label: "Start",
      date: new Date(firstSnapshotTime - 86_400_000).toISOString(),
      equity: input.startingCapital,
    },
    ...orderedSnapshots.map((snapshot) => ({
      label: snapshot.snapshot_date,
      date: snapshot.snapshot_date,
      equity: snapshot.equity_value,
    })),
  ];

  return points;
}

export function calculatePerformanceStats(input: {
  settings: SettingsRow;
  openTrades: TradeRow[];
  closedTrades: TradeRow[];
  snapshots: EquitySnapshotRow[];
  benchmark: {
    label: string;
    returnPct: number;
  };
  currentYear?: number;
}) {
  const decisiveClosedTrades = input.closedTrades.filter((trade) => {
    const baseline = trade.pnl_percent ?? trade.r_multiple;
    return typeof baseline === "number" && baseline !== 0;
  });

  const wins = decisiveClosedTrades.filter((trade) => (trade.pnl_percent ?? trade.r_multiple ?? 0) > 0)
    .length;
  const losses = decisiveClosedTrades.filter((trade) => (trade.pnl_percent ?? trade.r_multiple ?? 0) < 0)
    .length;
  const breakeven = input.closedTrades.filter(
    (trade) => (trade.pnl_percent ?? trade.r_multiple ?? 0) === 0,
  ).length;

  const averageRValues = input.closedTrades
    .map((trade) => trade.r_multiple)
    .filter((value): value is number => typeof value === "number");

  const averageR =
    averageRValues.length > 0
      ? averageRValues.reduce((sum, value) => sum + value, 0) / averageRValues.length
      : null;

  const equityCurve = buildEquityCurve({
    startingCapital: input.settings.starting_capital,
    snapshots: input.snapshots,
    closedTrades: input.closedTrades,
  });
  const currentEquity = equityCurve[equityCurve.length - 1]?.equity ?? input.settings.starting_capital;
  const currentYear = input.currentYear ?? new Date().getUTCFullYear();
  const realizedClosedTrades = input.closedTrades.filter(
    (trade) => typeof trade.pnl_dollars === "number",
  );
  const ytdRealizedPnl = realizedClosedTrades
    .filter((trade) => getTradeClosedYear(trade) === currentYear)
    .reduce((sum, trade) => sum + (trade.pnl_dollars ?? 0), 0);
  const preYearRealizedPnl = realizedClosedTrades
    .filter((trade) => {
      const closedYear = getTradeClosedYear(trade);
      return typeof closedYear === "number" && closedYear < currentYear;
    })
    .reduce((sum, trade) => sum + (trade.pnl_dollars ?? 0), 0);
  const yearStartEquity = input.settings.starting_capital + preYearRealizedPnl;
  const ytdReturnPct = yearStartEquity > 0 ? (ytdRealizedPnl / yearStartEquity) * 100 : 0;
  const totalReturnPct =
    input.settings.starting_capital > 0
      ? ((currentEquity - input.settings.starting_capital) / input.settings.starting_capital) *
        100
      : 0;
  const benchmarkLabel = input.benchmark.label;
  const benchmarkReturnPct = input.benchmark.returnPct;

  const rankedTrades = [...input.closedTrades].sort(
    (left, right) => (right.pnl_percent ?? -999) - (left.pnl_percent ?? -999),
  );

  const stats: PerformanceStats = {
    totalTrades: input.openTrades.length + input.closedTrades.length,
    openTrades: input.openTrades.length,
    closedTrades: input.closedTrades.length,
    wins,
    losses,
    breakeven,
    winRate: wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0,
    averageR,
    ytdReturnPct,
    totalReturnPct,
    currentEquity,
    spxComparison: {
      label: benchmarkLabel,
      benchmarkReturnPct,
      relativePerformancePct: ytdReturnPct - benchmarkReturnPct,
    },
    bestTrade: rankedTrades[0] ?? null,
    worstTrade: rankedTrades[rankedTrades.length - 1] ?? null,
  };

  return {
    stats,
    equityCurve,
  };
}
