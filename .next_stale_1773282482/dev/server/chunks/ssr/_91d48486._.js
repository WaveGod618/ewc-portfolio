module.exports = [
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
"[project]/src/lib/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00604e3e9a3006c5b19b98aece47f223fac7469108":"logoutAction","403f8ea12b56d864716d30e5a86d6667b66258a311":"saveTradeAction","408f6befc3f9990221eff25e029539e28a3c4282c5":"closeTradeAction","4093662e590ecb5ecb4d014b066efb8507fce0a5e3":"loginAction","40f5cc4831421b3932de2261f2e6cae76c6738c332":"updateSettingsAction","40f757acfd3499f154f69defcbbb4e9c0a0e8052a4":"createSnapshotAction"},"",""] */ __turbopack_context__.s([
    "closeTradeAction",
    ()=>closeTradeAction,
    "createSnapshotAction",
    ()=>createSnapshotAction,
    "loginAction",
    ()=>loginAction,
    "logoutAction",
    ()=>logoutAction,
    "saveTradeAction",
    ()=>saveTradeAction,
    "updateSettingsAction",
    ()=>updateSettingsAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trade-math.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
function ensureSupabaseConfig() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        throw new Error("Supabase environment variables are required for admin actions.");
    }
}
function revalidatePortfolioPaths() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/positions");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/history");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/rules");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin");
}
function sanitizeTradeStatus(value, allowed) {
    if (!value || !allowed.includes(value)) {
        throw new Error("Invalid trade status.");
    }
    return value;
}
async function loginAction(formData) {
    ensureSupabaseConfig();
    const email = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("email"), "Email");
    const password = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("password"), "Password");
    const nextPath = String(formData.get("next") ?? "/admin");
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/login?error=${encodeURIComponent(error.message)}`);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(nextPath.startsWith("/") ? nextPath : "/admin");
}
async function logoutAction() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    await supabase.auth.signOut();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
}
async function updateSettingsAction(formData) {
    ensureSupabaseConfig();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("id"));
    const payload = {
        id: id ?? undefined,
        starting_capital: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredNumber"])(formData.get("starting_capital"), "Starting capital"),
        portfolio_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("portfolio_name"), "Portfolio name"),
        disclaimer_text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("disclaimer_text"), "Disclaimer text")
    };
    const { error } = id ? await supabase.from("settings").update(payload).eq("id", id) : await supabase.from("settings").insert(payload);
    if (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePortfolioPaths();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin?saved=settings");
}
async function saveTradeAction(formData) {
    ensureSupabaseConfig();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("id"));
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("direction"), "Direction");
    const status = sanitizeTradeStatus((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("status"), "Status"), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EDITABLE_TRADE_STATUSES"]);
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRADE_DIRECTIONS"].includes(direction)) {
        throw new Error("Invalid direction.");
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const payload = {
        ticker: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("ticker"), "Ticker").toUpperCase(),
        direction,
        asset_type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("asset_type"), "Asset type"),
        entry_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredNumber"])(formData.get("entry_price"), "Entry price"),
        stop_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredNumber"])(formData.get("stop_price"), "Stop price"),
        target_1: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalNumber"])(formData.get("target_1")),
        target_2: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalNumber"])(formData.get("target_2")),
        target_3: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalNumber"])(formData.get("target_3")),
        position_size_pct: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalNumber"])(formData.get("position_size_pct")),
        status,
        opened_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toIsoDateTime"])(formData.get("opened_at")),
        source_label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("source_label")),
        source_link: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("source_link")),
        notes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("notes")),
        chart_image_url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("chart_image_url"))
    };
    const { error } = id ? await supabase.from("trades").update(payload).eq("id", id) : await supabase.from("trades").insert(payload);
    if (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePortfolioPaths();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin?saved=trade");
}
async function closeTradeAction(formData) {
    ensureSupabaseConfig();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("id"), "Trade id");
    const exitPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredNumber"])(formData.get("exit_price"), "Exit price");
    const closedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toIsoDateTime"])(formData.get("closed_at"));
    const finalStatus = sanitizeTradeStatus((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredText"])(formData.get("status"), "Final status"), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FINAL_TRADE_STATUSES"]);
    const outcomeLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("outcome_label")) ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["OUTCOME_LABELS"][2];
    const closingNotes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("closing_notes"));
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const [tradeResponse, settingsResponse, snapshotResponse] = await Promise.all([
        supabase.from("trades").select("*").eq("id", id).maybeSingle(),
        supabase.from("settings").select("*").order("created_at", {
            ascending: true
        }).limit(1).maybeSingle(),
        supabase.from("equity_snapshots").select("*").order("snapshot_date", {
            ascending: false
        }).limit(1).maybeSingle()
    ]);
    if (tradeResponse.error || !tradeResponse.data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(tradeResponse.error?.message ?? "Trade not found.")}`);
    }
    if (settingsResponse.error || !settingsResponse.data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(settingsResponse.error?.message ?? "Portfolio settings not found.")}`);
    }
    const trade = tradeResponse.data;
    const settings = settingsResponse.data;
    const outcome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trade$2d$math$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateTradeOutcome"])({
        direction: trade.direction,
        entryPrice: trade.entry_price,
        stopPrice: trade.stop_price,
        exitPrice,
        positionSizePct: trade.position_size_pct,
        startingCapital: settings.starting_capital
    });
    const nextNotes = [
        trade.notes,
        closingNotes
    ].filter(Boolean).join("\n\n");
    const { error: updateError } = await supabase.from("trades").update({
        status: finalStatus,
        exit_price: exitPrice,
        closed_at: closedAt,
        pnl_percent: outcome.pnlPercent,
        pnl_dollars: outcome.pnlDollars,
        r_multiple: outcome.rMultiple,
        outcome_label: outcomeLabel,
        notes: nextNotes || null
    }).eq("id", id);
    if (updateError) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(updateError.message)}`);
    }
    if (typeof outcome.pnlDollars === "number") {
        const lastEquity = snapshotResponse.data?.equity_value ?? settings.starting_capital;
        const snapshotNote = `${trade.ticker} ${finalStatus} auto snapshot`;
        const { error: snapshotError } = await supabase.from("equity_snapshots").insert({
            snapshot_date: closedAt,
            equity_value: Number((lastEquity + outcome.pnlDollars).toFixed(2)),
            note: snapshotNote
        });
        if (snapshotError) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(snapshotError.message)}`);
        }
    }
    revalidatePortfolioPaths();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin?saved=close");
}
async function createSnapshotAction(formData) {
    ensureSupabaseConfig();
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    const payload = {
        snapshot_date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toIsoDateTime"])(formData.get("snapshot_date")),
        equity_value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseRequiredNumber"])(formData.get("equity_value"), "Equity value"),
        note: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOptionalText"])(formData.get("note"))
    };
    const { error } = await supabase.from("equity_snapshots").insert(payload);
    if (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(`/admin?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePortfolioPaths();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin?saved=snapshot");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAction,
    logoutAction,
    updateSettingsAction,
    saveTradeAction,
    closeTradeAction,
    createSnapshotAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAction, "4093662e590ecb5ecb4d014b066efb8507fce0a5e3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAction, "00604e3e9a3006c5b19b98aece47f223fac7469108", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSettingsAction, "40f5cc4831421b3932de2261f2e6cae76c6738c332", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveTradeAction, "403f8ea12b56d864716d30e5a86d6667b66258a311", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(closeTradeAction, "408f6befc3f9990221eff25e029539e28a3c4282c5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createSnapshotAction, "40f757acfd3499f154f69defcbbb4e9c0a0e8052a4", null);
}),
"[project]/.next-internal/server/app/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/lib/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00604e3e9a3006c5b19b98aece47f223fac7469108",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"],
    "403f8ea12b56d864716d30e5a86d6667b66258a311",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveTradeAction"],
    "408f6befc3f9990221eff25e029539e28a3c4282c5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["closeTradeAction"],
    "4093662e590ecb5ecb4d014b066efb8507fce0a5e3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAction"],
    "40f5cc4831421b3932de2261f2e6cae76c6738c332",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateSettingsAction"],
    "40f757acfd3499f154f69defcbbb4e9c0a0e8052a4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSnapshotAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/page/actions.js { ACTIONS_MODULE0 => "[project]/src/lib/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_91d48486._.js.map