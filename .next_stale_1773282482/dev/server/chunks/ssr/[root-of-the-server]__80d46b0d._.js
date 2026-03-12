module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildTickerOptions",
    ()=>buildTickerOptions,
    "cn",
    ()=>cn,
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured,
    "parseOptionalNumber",
    ()=>parseOptionalNumber,
    "parseOptionalText",
    ()=>parseOptionalText,
    "parseRequiredNumber",
    ()=>parseRequiredNumber,
    "parseRequiredText",
    ()=>parseRequiredText,
    "toIsoDateTime",
    ()=>toIsoDateTime,
    "truncateText",
    ()=>truncateText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function isSupabaseConfigured() {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
function parseOptionalNumber(value) {
    if (value === null) {
        return null;
    }
    const normalized = String(value).trim();
    if (!normalized) {
        return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}
function parseRequiredNumber(value, label) {
    const parsed = parseOptionalNumber(value);
    if (parsed === null) {
        throw new Error(`${label} is required.`);
    }
    return parsed;
}
function parseOptionalText(value) {
    const normalized = String(value ?? "").trim();
    return normalized ? normalized : null;
}
function parseRequiredText(value, label) {
    const normalized = String(value ?? "").trim();
    if (!normalized) {
        throw new Error(`${label} is required.`);
    }
    return normalized;
}
function toIsoDateTime(value, fallback = new Date()) {
    const normalized = String(value ?? "").trim();
    return normalized ? new Date(normalized).toISOString() : fallback.toISOString();
}
function truncateText(value, length = 96) {
    if (!value) {
        return "";
    }
    if (value.length <= length) {
        return value;
    }
    return `${value.slice(0, length).trim()}...`;
}
function buildTickerOptions(tickers) {
    return Array.from(new Set(tickers.map((ticker)=>ticker.toUpperCase()))).sort();
}
}),
"[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
;
;
function Badge({ children, variant = "default", className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]", variant === "default" && "border-white/10 bg-white/5 text-muted-foreground", variant === "positive" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-300", variant === "negative" && "border-red-500/20 bg-red-500/10 text-red-300", variant === "warning" && "border-amber-500/20 bg-amber-500/10 text-amber-300", variant === "info" && "border-sky-500/20 bg-sky-500/10 text-sky-300", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/ui/card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardDescription",
    ()=>CardDescription,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
;
;
function Card({ children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("rounded-3xl border border-white/10 bg-card/85 p-6 shadow-panel backdrop-blur", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
function CardHeader({ children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("mb-6 flex items-start justify-between gap-4", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
function CardTitle({ children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold tracking-tight text-foreground", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
function CardDescription({ children, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ASSET_TYPES",
    ()=>ASSET_TYPES,
    "DEFAULT_DISCLAIMER",
    ()=>DEFAULT_DISCLAIMER,
    "EDITABLE_TRADE_STATUSES",
    ()=>EDITABLE_TRADE_STATUSES,
    "FINAL_TRADE_STATUSES",
    ()=>FINAL_TRADE_STATUSES,
    "NAV_ITEMS",
    ()=>NAV_ITEMS,
    "OUTCOME_LABELS",
    ()=>OUTCOME_LABELS,
    "SOURCE_LABELS",
    ()=>SOURCE_LABELS,
    "TRADE_DIRECTIONS",
    ()=>TRADE_DIRECTIONS,
    "TRADE_STATUSES",
    ()=>TRADE_STATUSES
]);
const DEFAULT_DISCLAIMER = "Hypothetical performance based on EWC posted trade signals. This model portfolio is for educational and transparency purposes only and does not represent actual brokerage or client account results. Real-world execution, slippage, commissions, and liquidity may materially impact performance.";
const NAV_ITEMS = [
    {
        href: "/",
        label: "Dashboard"
    },
    {
        href: "/positions",
        label: "Open Positions"
    },
    {
        href: "/history",
        label: "Closed Trades"
    },
    {
        href: "/rules",
        label: "Rules"
    },
    {
        href: "/admin",
        label: "Admin"
    }
];
const TRADE_DIRECTIONS = [
    "long",
    "short"
];
const ASSET_TYPES = [
    "stock",
    "futures",
    "crypto",
    "other"
];
const TRADE_STATUSES = [
    "open",
    "closed",
    "stopped",
    "partial",
    "cancelled"
];
const EDITABLE_TRADE_STATUSES = [
    "open",
    "partial",
    "cancelled"
];
const FINAL_TRADE_STATUSES = [
    "closed",
    "stopped",
    "partial"
];
const OUTCOME_LABELS = [
    "target hit",
    "stopped out",
    "manual close",
    "partial win",
    "break even"
];
const SOURCE_LABELS = [
    "Discord",
    "Weekly Projections",
    "Swing Signal"
];
}),
"[project]/src/lib/trade-math.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEquityCurve",
    ()=>buildEquityCurve,
    "calculatePerformanceStats",
    ()=>calculatePerformanceStats,
    "calculateTradeOutcome",
    ()=>calculateTradeOutcome,
    "directionalMove",
    ()=>directionalMove,
    "isTradeClosed",
    ()=>isTradeClosed,
    "isTradeOpen",
    ()=>isTradeOpen
]);
function directionalMove(direction, entry, reference) {
    return direction === "long" ? reference - entry : entry - reference;
}
function calculateTradeOutcome(input) {
    const directionalResult = directionalMove(input.direction, input.entryPrice, input.exitPrice);
    const riskPerUnit = Math.abs(input.entryPrice - input.stopPrice);
    const pnlPercent = input.entryPrice === 0 ? null : directionalResult / input.entryPrice * 100;
    const rMultiple = riskPerUnit === 0 ? null : directionalResult / riskPerUnit;
    const hasDollarSizing = typeof input.positionSizePct === "number" && input.positionSizePct > 0 && typeof input.startingCapital === "number" && input.startingCapital > 0 && typeof pnlPercent === "number";
    const pnlDollars = hasDollarSizing ? input.startingCapital * (input.positionSizePct / 100) * (pnlPercent / 100) : null;
    return {
        pnlPercent,
        pnlDollars,
        rMultiple
    };
}
function isTradeOpen(trade) {
    return trade.status === "open" || trade.status === "partial" && !trade.closed_at;
}
function isTradeClosed(trade) {
    return !isTradeOpen(trade);
}
function buildSyntheticCurve(startingCapital, closedTrades) {
    const points = [
        {
            label: "Start",
            date: "Start",
            equity: startingCapital
        }
    ];
    let runningEquity = startingCapital;
    closedTrades.filter((trade)=>typeof trade.pnl_dollars === "number").sort((left, right)=>new Date(left.closed_at ?? left.opened_at).getTime() - new Date(right.closed_at ?? right.opened_at).getTime()).forEach((trade)=>{
        runningEquity += trade.pnl_dollars ?? 0;
        points.push({
            label: trade.closed_at ?? trade.opened_at,
            date: trade.closed_at ?? trade.opened_at,
            equity: Number(runningEquity.toFixed(2))
        });
    });
    return points;
}
function buildEquityCurve(input) {
    const orderedSnapshots = [
        ...input.snapshots
    ].sort((left, right)=>new Date(left.snapshot_date).getTime() - new Date(right.snapshot_date).getTime());
    if (orderedSnapshots.length === 0) {
        return buildSyntheticCurve(input.startingCapital, input.closedTrades);
    }
    const firstSnapshot = orderedSnapshots[0];
    const firstSnapshotTime = new Date(firstSnapshot.snapshot_date).getTime();
    const points = [
        {
            label: "Start",
            date: new Date(firstSnapshotTime - 86_400_000).toISOString(),
            equity: input.startingCapital
        },
        ...orderedSnapshots.map((snapshot)=>({
                label: snapshot.snapshot_date,
                date: snapshot.snapshot_date,
                equity: snapshot.equity_value
            }))
    ];
    return points;
}
function calculatePerformanceStats(input) {
    const decisiveClosedTrades = input.closedTrades.filter((trade)=>{
        const baseline = trade.pnl_percent ?? trade.r_multiple;
        return typeof baseline === "number" && baseline !== 0;
    });
    const wins = decisiveClosedTrades.filter((trade)=>(trade.pnl_percent ?? trade.r_multiple ?? 0) > 0).length;
    const losses = decisiveClosedTrades.filter((trade)=>(trade.pnl_percent ?? trade.r_multiple ?? 0) < 0).length;
    const breakeven = input.closedTrades.filter((trade)=>(trade.pnl_percent ?? trade.r_multiple ?? 0) === 0).length;
    const averageRValues = input.closedTrades.map((trade)=>trade.r_multiple).filter((value)=>typeof value === "number");
    const averageR = averageRValues.length > 0 ? averageRValues.reduce((sum, value)=>sum + value, 0) / averageRValues.length : null;
    const equityCurve = buildEquityCurve({
        startingCapital: input.settings.starting_capital,
        snapshots: input.snapshots,
        closedTrades: input.closedTrades
    });
    const currentEquity = equityCurve[equityCurve.length - 1]?.equity ?? input.settings.starting_capital;
    const totalReturnPct = input.settings.starting_capital > 0 ? (currentEquity - input.settings.starting_capital) / input.settings.starting_capital * 100 : 0;
    const rankedTrades = [
        ...input.closedTrades
    ].sort((left, right)=>(right.pnl_percent ?? -999) - (left.pnl_percent ?? -999));
    const stats = {
        totalTrades: input.openTrades.length + input.closedTrades.length,
        openTrades: input.openTrades.length,
        closedTrades: input.closedTrades.length,
        wins,
        losses,
        breakeven,
        winRate: wins + losses > 0 ? wins / (wins + losses) * 100 : 0,
        averageR,
        totalReturnPct,
        currentEquity,
        bestTrade: rankedTrades[0] ?? null,
        worstTrade: rankedTrades[rankedTrades.length - 1] ?? null
    };
    return {
        stats,
        equityCurve
    };
}
}),
"[project]/src/lib/sample-data.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sampleSettings",
    ()=>sampleSettings,
    "sampleSnapshots",
    ()=>sampleSnapshots,
    "sampleTrades",
    ()=>sampleTrades
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trade-math.ts [app-rsc] (ecmascript)");
;
;
const now = "2026-03-09T10:00:00.000Z";
const startingCapital = 100_000;
const createClosedTrade = (trade)=>{
    const outcome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateTradeOutcome"])({
        direction: trade.direction,
        entryPrice: trade.entry_price,
        stopPrice: trade.stop_price,
        exitPrice: trade.exit_price ?? trade.entry_price,
        positionSizePct: trade.position_size_pct,
        startingCapital
    });
    return {
        ...trade,
        pnl_percent: outcome.pnlPercent,
        pnl_dollars: outcome.pnlDollars,
        r_multiple: outcome.rMultiple
    };
};
const sampleSettings = {
    id: "00000000-0000-0000-0000-000000000001",
    starting_capital: startingCapital,
    portfolio_name: "EWC Model Portfolio",
    disclaimer_text: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_DISCLAIMER"],
    created_at: now,
    updated_at: now
};
const sampleTrades = [
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
        updated_at: now
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
        updated_at: now
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
        updated_at: now
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
        updated_at: now
    },
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000201",
        ticker: "MSFT",
        direction: "long",
        asset_type: "stock",
        entry_price: 418,
        stop_price: 401,
        target_1: 432,
        target_2: 441,
        target_3: 448,
        position_size_pct: 12,
        status: "closed",
        opened_at: "2026-01-12T15:00:00.000Z",
        closed_at: "2026-01-17T19:00:00.000Z",
        exit_price: 444,
        notes: "Trend continuation breakout with strong breadth confirmation.",
        chart_image_url: null,
        source_label: "Swing Signal",
        source_link: null,
        outcome_label: "target hit",
        created_at: now,
        updated_at: now
    }),
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000202",
        ticker: "QQQ",
        direction: "short",
        asset_type: "stock",
        entry_price: 523,
        stop_price: 534,
        target_1: 514,
        target_2: 507,
        target_3: 501,
        position_size_pct: 15,
        status: "closed",
        opened_at: "2026-01-21T14:45:00.000Z",
        closed_at: "2026-01-24T18:30:00.000Z",
        exit_price: 507,
        notes: "Index rejected the weekly high and offered a clean downside unwind.",
        chart_image_url: null,
        source_label: "Weekly Projections",
        source_link: null,
        outcome_label: "target hit",
        created_at: now,
        updated_at: now
    }),
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000203",
        ticker: "NFLX",
        direction: "long",
        asset_type: "stock",
        entry_price: 892,
        stop_price: 860,
        target_1: 920,
        target_2: 940,
        target_3: null,
        position_size_pct: 10,
        status: "stopped",
        opened_at: "2026-01-28T16:05:00.000Z",
        closed_at: "2026-01-30T17:20:00.000Z",
        exit_price: 858,
        notes: "Setup failed after earnings gap follow-through faded.",
        chart_image_url: null,
        source_label: "Discord",
        source_link: null,
        outcome_label: "stopped out",
        created_at: now,
        updated_at: now
    }),
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000204",
        ticker: "ETH",
        direction: "long",
        asset_type: "crypto",
        entry_price: 3380,
        stop_price: 3210,
        target_1: 3520,
        target_2: 3650,
        target_3: 3780,
        position_size_pct: 8,
        status: "closed",
        opened_at: "2026-02-03T13:10:00.000Z",
        closed_at: "2026-02-08T11:30:00.000Z",
        exit_price: 3655,
        notes: "Strong reclaim through the breakdown pivot produced the follow-through leg.",
        chart_image_url: null,
        source_label: "Discord",
        source_link: null,
        outcome_label: "target hit",
        created_at: now,
        updated_at: now
    }),
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000205",
        ticker: "META",
        direction: "short",
        asset_type: "stock",
        entry_price: 694,
        stop_price: 720,
        target_1: 671,
        target_2: 660,
        target_3: null,
        position_size_pct: 8,
        status: "stopped",
        opened_at: "2026-02-11T15:25:00.000Z",
        closed_at: "2026-02-13T14:10:00.000Z",
        exit_price: 709,
        notes: "The rejection failed once buyers reclaimed the impulse shelf.",
        chart_image_url: null,
        source_label: "Discord",
        source_link: null,
        outcome_label: "manual close",
        created_at: now,
        updated_at: now
    }),
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000206",
        ticker: "CL",
        direction: "short",
        asset_type: "futures",
        entry_price: 74.8,
        stop_price: 77.2,
        target_1: 72.2,
        target_2: 69.5,
        target_3: 68.8,
        position_size_pct: 10,
        status: "closed",
        opened_at: "2026-02-18T13:45:00.000Z",
        closed_at: "2026-02-20T16:30:00.000Z",
        exit_price: 69.3,
        notes: "Commodities weakness accelerated after the lower high confirmed.",
        chart_image_url: null,
        source_label: "Weekly Projections",
        source_link: null,
        outcome_label: "target hit",
        created_at: now,
        updated_at: now
    }),
    createClosedTrade({
        id: "00000000-0000-0000-0000-000000000207",
        ticker: "AMZN",
        direction: "long",
        asset_type: "stock",
        entry_price: 227,
        stop_price: 219,
        target_1: 233,
        target_2: 236,
        target_3: 240,
        position_size_pct: 12,
        status: "closed",
        opened_at: "2026-02-22T18:10:00.000Z",
        closed_at: "2026-02-25T19:45:00.000Z",
        exit_price: 236,
        notes: "Trend continuation long that paid cleanly into target two.",
        chart_image_url: null,
        source_label: "Swing Signal",
        source_link: null,
        outcome_label: "partial win",
        created_at: now,
        updated_at: now
    })
];
const sampleSnapshots = [
    {
        id: "00000000-0000-0000-0000-000000000301",
        snapshot_date: "2026-01-01T00:00:00.000Z",
        equity_value: 100000,
        note: "Starting model capital",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000302",
        snapshot_date: "2026-01-17T00:00:00.000Z",
        equity_value: 100897,
        note: "MSFT target hit",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000303",
        snapshot_date: "2026-01-24T00:00:00.000Z",
        equity_value: 101586,
        note: "QQQ downside follow-through",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000304",
        snapshot_date: "2026-01-30T00:00:00.000Z",
        equity_value: 101205,
        note: "NFLX stop",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000305",
        snapshot_date: "2026-02-08T00:00:00.000Z",
        equity_value: 101856,
        note: "ETH strength captured",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000306",
        snapshot_date: "2026-02-20T00:00:00.000Z",
        equity_value: 102484,
        note: "CL target cluster",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000307",
        snapshot_date: "2026-02-25T00:00:00.000Z",
        equity_value: 102960,
        note: "AMZN close",
        created_at: now
    },
    {
        id: "00000000-0000-0000-0000-000000000308",
        snapshot_date: "2026-03-07T00:00:00.000Z",
        equity_value: 108240,
        note: "Manual equity normalization snapshot",
        created_at: now
    }
];
}),
"[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServerSupabaseClient",
    ()=>createServerSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
;
async function createServerSupabaseClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "", {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Cookie writes from server components can be safely ignored.
                }
            }
        }
    });
}
}),
"[project]/src/lib/queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminModelData",
    ()=>getAdminModelData,
    "getPublicModelData",
    ()=>getPublicModelData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sample-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trade-math.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
;
function sortTradesDescending(trades, field) {
    return [
        ...trades
    ].sort((left, right)=>new Date(right[field] ?? right.opened_at).getTime() - new Date(left[field] ?? left.opened_at).getTime());
}
function buildModelData(input) {
    const openTrades = sortTradesDescending(input.trades.filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isTradeOpen"]), "opened_at");
    const closedTrades = sortTradesDescending(input.trades.filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isTradeClosed"]), "closed_at");
    const { stats, equityCurve } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculatePerformanceStats"])({
        settings: input.settings,
        openTrades,
        closedTrades,
        snapshots: input.snapshots
    });
    return {
        settings: input.settings,
        openTrades,
        closedTrades,
        latestClosedTrades: closedTrades.slice(0, 6),
        latestOpenTrades: openTrades.slice(0, 4),
        stats,
        equityCurve,
        snapshots: input.snapshots,
        previewMode: input.previewMode
    };
}
const getPublicModelData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        return buildModelData({
            settings: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sampleSettings"],
            trades: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sampleTrades"],
            snapshots: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sampleSnapshots"],
            previewMode: true
        });
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const [settingsResponse, tradesResponse, snapshotsResponse] = await Promise.all([
        supabase.from("settings").select("*").order("created_at", {
            ascending: true
        }).limit(1).maybeSingle(),
        supabase.from("trades").select("*").order("opened_at", {
            ascending: false
        }),
        supabase.from("equity_snapshots").select("*").order("snapshot_date", {
            ascending: true
        })
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
    const settings = settingsResponse.data ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sample$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sampleSettings"];
    const trades = tradesResponse.data ?? [];
    const snapshots = snapshotsResponse.data ?? [];
    return buildModelData({
        settings,
        trades,
        snapshots,
        previewMode: false
    });
});
async function getAdminModelData(input) {
    const data = await getPublicModelData();
    return {
        ...data,
        selectedTrade: data.openTrades.find((trade)=>trade.id === input.editTradeId) ?? data.closedTrades.find((trade)=>trade.id === input.editTradeId) ?? null,
        closeTrade: data.openTrades.find((trade)=>trade.id === input.closeTradeId) ?? null
    };
}
}),
"[project]/src/app/rules/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RulesPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/queries.ts [app-rsc] (ecmascript)");
;
;
;
;
const dynamic = "force-dynamic";
const rules = [
    "This is a hypothetical model portfolio built from posted EWC trade signals.",
    "Results do not represent actual brokerage accounts, client accounts, or verified third-party statements.",
    "Slippage, commissions, liquidity, spreads, and order execution may differ materially from any model result shown here.",
    "Long and short trade outcomes are tracked manually according to the direction and posted signal structure.",
    "Entries, stops, targets, exits, and equity snapshots are maintained for transparency and educational review.",
    "Position sizing may be simplified and some trades may only report percentage or R-based performance when dollar sizing is not available."
];
async function RulesPage() {
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPublicModelData"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-[2rem] border border-white/10 bg-card/90 px-6 py-8 shadow-panel sm:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "info",
                        children: "Rules & Disclaimer"
                    }, void 0, false, {
                        fileName: "[project]/src/app/rules/page.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-heading mt-4 text-4xl font-semibold tracking-tight text-foreground",
                        children: "Transparency rules"
                    }, void 0, false, {
                        fileName: "[project]/src/app/rules/page.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 max-w-3xl text-base leading-7 text-muted-foreground",
                        children: "The EWC Model Portfolio is designed to communicate hypothetical signal performance clearly, without implying broker verification or actual account replication."
                    }, void 0, false, {
                        fileName: "[project]/src/app/rules/page.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/rules/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-foreground",
                                children: "How this model is tracked"
                            }, void 0, false, {
                                fileName: "[project]/src/app/rules/page.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 grid gap-4",
                                children: rules.map((rule)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-3xl border border-white/10 bg-white/5 p-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm leading-7 text-muted-foreground",
                                            children: rule
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/rules/page.tsx",
                                            lineNumber: 38,
                                            columnNumber: 17
                                        }, this)
                                    }, rule, false, {
                                        fileName: "[project]/src/app/rules/page.tsx",
                                        lineNumber: 37,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/rules/page.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/rules/page.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold text-foreground",
                                children: "Current disclaimer"
                            }, void 0, false, {
                                fileName: "[project]/src/app/rules/page.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm leading-7 text-muted-foreground",
                                children: data.settings.disclaimer_text
                            }, void 0, false, {
                                fileName: "[project]/src/app/rules/page.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/rules/page.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/rules/page.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/rules/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/rules/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/rules/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__80d46b0d._.js.map