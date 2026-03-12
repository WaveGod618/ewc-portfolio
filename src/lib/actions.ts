"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  EDITABLE_TRADE_STATUSES,
  FINAL_TRADE_STATUSES,
  OUTCOME_LABELS,
  TRADE_DIRECTIONS,
} from "@/lib/constants";
import { calculateTradeOutcome } from "@/lib/trade-math";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TradeStatus } from "@/lib/types";
import {
  isSupabaseConfigured,
  parseOptionalNumber,
  parseOptionalText,
  parseRequiredNumber,
  parseRequiredText,
  toIsoDateTime,
} from "@/lib/utils";

function ensureSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are required for admin actions.");
  }
}

function revalidatePortfolioPaths() {
  revalidatePath("/");
  revalidatePath("/positions");
  revalidatePath("/history");
  revalidatePath("/rules");
  revalidatePath("/admin");
}

function adminRedirectUrl(input: {
  section?: string | null;
  saved?: string;
  error?: string;
}) {
  const searchParams = new URLSearchParams();

  if (input.section) {
    searchParams.set("section", input.section);
  }

  if (input.saved) {
    searchParams.set("saved", input.saved);
  }

  if (input.error) {
    searchParams.set("error", input.error);
  }

  const query = searchParams.toString();
  return `/admin${query ? `?${query}` : ""}`;
}

function sanitizeTradeStatus(value: string | null, allowed: readonly TradeStatus[]) {
  if (!value || !allowed.includes(value as TradeStatus)) {
    throw new Error("Invalid trade status.");
  }

  return value as TradeStatus;
}

export async function loginAction(formData: FormData) {
  ensureSupabaseConfig();

  const email = parseRequiredText(formData.get("email"), "Email");
  const password = parseRequiredText(formData.get("password"), "Password");
  const nextPath = String(formData.get("next") ?? "/admin");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath.startsWith("/") ? nextPath : "/admin");
}

export async function logoutAction() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  redirect("/login");
}

export async function updateSettingsAction(formData: FormData) {
  ensureSupabaseConfig();

  const supabase = await createServerSupabaseClient();
  const id = parseOptionalText(formData.get("id"));
  const redirectSection = parseOptionalText(formData.get("redirect_section"));

  const payload = {
    id: id ?? undefined,
    starting_capital: parseRequiredNumber(
      formData.get("starting_capital"),
      "Starting capital",
    ),
    portfolio_name: parseRequiredText(formData.get("portfolio_name"), "Portfolio name"),
    disclaimer_text: parseRequiredText(
      formData.get("disclaimer_text"),
      "Disclaimer text",
    ),
  };

  const { error } = id
    ? await supabase.from("settings").update(payload).eq("id", id)
    : await supabase.from("settings").insert(payload);

  if (error) {
    redirect(adminRedirectUrl({ section: redirectSection, error: error.message }));
  }

  revalidatePortfolioPaths();
  redirect(adminRedirectUrl({ section: redirectSection, saved: "settings" }));
}

export async function saveTradeAction(formData: FormData) {
  ensureSupabaseConfig();

  const id = parseOptionalText(formData.get("id"));
  const redirectSection = parseOptionalText(formData.get("redirect_section"));
  const direction = parseRequiredText(formData.get("direction"), "Direction");
  const status = sanitizeTradeStatus(
    parseRequiredText(formData.get("status"), "Status"),
    EDITABLE_TRADE_STATUSES,
  );

  if (!TRADE_DIRECTIONS.includes(direction as (typeof TRADE_DIRECTIONS)[number])) {
    throw new Error("Invalid direction.");
  }

  const supabase = await createServerSupabaseClient();
  const payload = {
    ticker: parseRequiredText(formData.get("ticker"), "Ticker").toUpperCase(),
    direction,
    asset_type: parseRequiredText(formData.get("asset_type"), "Asset type"),
    entry_price: parseRequiredNumber(formData.get("entry_price"), "Entry price"),
    stop_price: parseRequiredNumber(formData.get("stop_price"), "Stop price"),
    target_1: parseOptionalNumber(formData.get("target_1")),
    target_2: parseOptionalNumber(formData.get("target_2")),
    target_3: parseOptionalNumber(formData.get("target_3")),
    position_size_pct: parseOptionalNumber(formData.get("position_size_pct")),
    status,
    opened_at: toIsoDateTime(formData.get("opened_at")),
    source_label: parseOptionalText(formData.get("source_label")),
    source_link: parseOptionalText(formData.get("source_link")),
    notes: parseOptionalText(formData.get("notes")),
    chart_image_url: parseOptionalText(formData.get("chart_image_url")),
  };

  const { error } = id
    ? await supabase.from("trades").update(payload).eq("id", id)
    : await supabase.from("trades").insert(payload);

  if (error) {
    redirect(adminRedirectUrl({ section: redirectSection, error: error.message }));
  }

  revalidatePortfolioPaths();
  redirect(adminRedirectUrl({ section: redirectSection, saved: "trade" }));
}

export async function closeTradeAction(formData: FormData) {
  ensureSupabaseConfig();

  const id = parseRequiredText(formData.get("id"), "Trade id");
  const redirectSection = parseOptionalText(formData.get("redirect_section"));
  const exitPrice = parseRequiredNumber(formData.get("exit_price"), "Exit price");
  const closedAt = toIsoDateTime(formData.get("closed_at"));
  const finalStatus = sanitizeTradeStatus(
    parseRequiredText(formData.get("status"), "Final status"),
    FINAL_TRADE_STATUSES,
  );
  const outcomeLabel =
    parseOptionalText(formData.get("outcome_label")) ?? OUTCOME_LABELS[2];
  const closingNotes = parseOptionalText(formData.get("closing_notes"));

  const supabase = await createServerSupabaseClient();
  const [tradeResponse, settingsResponse, snapshotResponse] = await Promise.all([
    supabase.from("trades").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("equity_snapshots")
      .select("*")
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (tradeResponse.error || !tradeResponse.data) {
    redirect(
      adminRedirectUrl({
        section: redirectSection,
        error: tradeResponse.error?.message ?? "Trade not found.",
      }),
    );
  }

  if (settingsResponse.error || !settingsResponse.data) {
    redirect(
      adminRedirectUrl({
        section: redirectSection,
        error: settingsResponse.error?.message ?? "Portfolio settings not found.",
      }),
    );
  }

  const trade = tradeResponse.data;
  const settings = settingsResponse.data;
  const outcome = calculateTradeOutcome({
    direction: trade.direction,
    entryPrice: trade.entry_price,
    stopPrice: trade.stop_price,
    exitPrice,
    positionSizePct: trade.position_size_pct,
    startingCapital: settings.starting_capital,
  });

  const nextNotes = [trade.notes, closingNotes].filter(Boolean).join("\n\n");
  const { error: updateError } = await supabase
    .from("trades")
    .update({
      status: finalStatus,
      exit_price: exitPrice,
      closed_at: closedAt,
      pnl_percent: outcome.pnlPercent,
      pnl_dollars: outcome.pnlDollars,
      r_multiple: outcome.rMultiple,
      outcome_label: outcomeLabel,
      notes: nextNotes || null,
    })
    .eq("id", id);

  if (updateError) {
    redirect(adminRedirectUrl({ section: redirectSection, error: updateError.message }));
  }

  if (typeof outcome.pnlDollars === "number") {
    const lastEquity =
      snapshotResponse.data?.equity_value ?? settings.starting_capital;
    const snapshotNote = `${trade.ticker} ${finalStatus} auto snapshot`;

    const { error: snapshotError } = await supabase.from("equity_snapshots").insert({
      snapshot_date: closedAt,
      equity_value: Number((lastEquity + outcome.pnlDollars).toFixed(2)),
      note: snapshotNote,
    });

    if (snapshotError) {
      redirect(adminRedirectUrl({ section: redirectSection, error: snapshotError.message }));
    }
  }

  revalidatePortfolioPaths();
  redirect(adminRedirectUrl({ section: redirectSection, saved: "close" }));
}

export async function createSnapshotAction(formData: FormData) {
  ensureSupabaseConfig();

  const supabase = await createServerSupabaseClient();
  const redirectSection = parseOptionalText(formData.get("redirect_section"));
  const payload = {
    snapshot_date: toIsoDateTime(formData.get("snapshot_date")),
    equity_value: parseRequiredNumber(formData.get("equity_value"), "Equity value"),
    note: parseOptionalText(formData.get("note")),
  };

  const { error } = await supabase.from("equity_snapshots").insert(payload);

  if (error) {
    redirect(adminRedirectUrl({ section: redirectSection, error: error.message }));
  }

  revalidatePortfolioPaths();
  redirect(adminRedirectUrl({ section: redirectSection, saved: "snapshot" }));
}
