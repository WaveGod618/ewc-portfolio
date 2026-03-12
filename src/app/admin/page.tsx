import Link from "next/link";
import { redirect } from "next/navigation";

import { CloseTradeForm } from "@/components/admin/close-trade-form";
import { EquitySnapshotForm } from "@/components/admin/equity-snapshot-form";
import { SettingsForm } from "@/components/admin/settings-form";
import { TradeForm } from "@/components/admin/trade-form";
import { OpenPositionsTable } from "@/components/trades/open-positions-table";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, formatPercent } from "@/lib/formatters";
import { getAdminModelData } from "@/lib/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cn, isSupabaseConfigured } from "@/lib/utils";
import { logoutAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

const ADMIN_SECTIONS = [
  {
    id: "settings",
    label: "Settings",
    description: "Update branding, starting capital, and the public disclaimer.",
  },
  {
    id: "new-trade",
    label: "New Trade",
    description: "Log a fresh EWC signal with targets, source context, and chart support.",
  },
  {
    id: "manage",
    label: "Manage Open Trades",
    description: "Review live positions and edit the tracked setup before the trade resolves.",
  },
  {
    id: "close",
    label: "Close Trade",
    description: "Finalize open signals and calculate long or short-aware exit performance.",
  },
  {
    id: "snapshots",
    label: "Snapshots",
    description: "Maintain the public equity curve with manual portfolio-level adjustments.",
  },
] as const;

type AdminSection = (typeof ADMIN_SECTIONS)[number]["id"];

function isAdminSection(value: string | undefined): value is AdminSection {
  return ADMIN_SECTIONS.some((section) => section.id === value);
}

type PageProps = {
  searchParams: Promise<{
    edit?: string;
    close?: string;
    error?: string;
    saved?: string;
    section?: string;
  }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const previewMode = !isSupabaseConfigured();
  const activeSection: AdminSection = isAdminSection(params.section)
    ? params.section
    : params.close
      ? "close"
      : params.edit
        ? "manage"
        : "new-trade";

  if (!previewMode) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect(`/login?next=${encodeURIComponent("/admin")}`);
    }
  }

  const data = await getAdminModelData({
    editTradeId: params.edit,
    closeTradeId: params.close,
  });
  const activeSectionMeta =
    ADMIN_SECTIONS.find((section) => section.id === activeSection) ?? ADMIN_SECTIONS[1];
  const recentSnapshots = [...data.snapshots].slice(-8).reverse();

  return (
    <div className="space-y-6">
      <section className="rounded-[1.9rem] border border-white/10 bg-card/90 px-5 py-6 shadow-panel sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Badge variant="info">Admin Console</Badge>
            <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-[2.35rem]">
              EWC portfolio operations
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Operational workspace for logging posted EWC signals, maintaining the public signal
              ledger, and keeping the hypothetical scoreboard current.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Long + short aware
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Hypothetical only
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Public scoreboard
              </span>
            </div>
          </div>
          {!previewMode ? (
            <form action={logoutAction}>
              <button className={buttonStyles({ variant: "secondary", size: "sm" })} type="submit">
                Sign out
              </button>
            </form>
          ) : null}
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Starting capital
            </p>
            <p className="mt-1.5 text-lg font-semibold text-foreground">
              {formatCurrency(data.settings.starting_capital)}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Current equity
            </p>
            <p className="mt-1.5 text-lg font-semibold text-foreground">
              {formatCurrency(data.stats.currentEquity)}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Net return
            </p>
            <p className="mt-1.5 text-lg font-semibold text-sky-300">
              {formatPercent(data.stats.totalReturnPct)}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Win rate
            </p>
            <p className="mt-1.5 text-lg font-semibold text-foreground">
              {formatPercent(data.stats.winRate)}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Open trades
            </p>
            <p className="mt-1.5 text-lg font-semibold text-foreground">{data.stats.openTrades}</p>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Closed trades
            </p>
            <p className="mt-1.5 text-lg font-semibold text-foreground">
              {data.stats.closedTrades}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {previewMode ? (
          <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-100/85">
            Preview mode active. Configure Supabase to enable live admin mutations.
          </div>
        ) : null}
        {params.error ? (
          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200">
            {params.error}
          </div>
        ) : null}
        {params.saved ? (
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
            Saved {params.saved === "close" ? "trade close" : params.saved}.
          </div>
        ) : null}
      </div>

      <Card className="p-3.5">
        <div className="flex flex-wrap gap-2">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.id}
              className={buttonStyles({
                variant: activeSection === section.id ? "primary" : "secondary",
                size: "sm",
                className: cn(
                  "rounded-[0.95rem] px-3.5",
                  activeSection !== section.id && "border-white/10 bg-white/[0.03]",
                ),
              })}
              href={`/admin?section=${section.id}`}
            >
              {section.label}
            </Link>
          ))}
        </div>
        <p className="mt-3 px-1 text-sm leading-6 text-muted-foreground">
          {activeSectionMeta.description}
        </p>
      </Card>

      {activeSection === "settings" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <SettingsForm disabled={previewMode} settings={data.settings} />
          <Card>
            <CardHeader>
              <div className="space-y-1.5">
                <CardTitle>Public presentation</CardTitle>
                <CardDescription>
                  These settings control the headline information visitors see across the public
                  dashboard.
                </CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3 text-sm leading-6 text-muted-foreground">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Portfolio name
                </p>
                <p className="mt-1.5 font-medium text-foreground">{data.settings.portfolio_name}</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  Current disclaimer
                </p>
                <p className="mt-1.5">{data.settings.disclaimer_text}</p>
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      {activeSection === "new-trade" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <TradeForm disabled={previewMode} trade={null} />
          <Card>
            <CardHeader>
              <div className="space-y-1.5">
                <CardTitle>Signal logging workflow</CardTitle>
                <CardDescription>
                  Keep the public ledger consistent by logging the same signal structure every time.
                </CardDescription>
              </div>
            </CardHeader>
            <div className="space-y-3 text-sm leading-6 text-muted-foreground">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3.5">
                Enter the posted ticker, direction, entry, stop, and primary targets exactly as the
                community received them.
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3.5">
                Use notes for structure, invalidation, and execution nuance. Keep commentary short
                so the public cards stay readable.
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3.5">
                Source labels and optional chart images help followers trace the origin of the
                tracked signal.
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      {activeSection === "manage" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.8fr)]">
          <Card>
            <CardHeader>
              <div className="space-y-1.5">
                <CardTitle>Manage open positions</CardTitle>
                <CardDescription>
                  Select a live signal to adjust its tracked setup, notes, status, or source context.
                </CardDescription>
              </div>
              {params.edit ? (
                <Link className={buttonStyles({ variant: "ghost", size: "sm" })} href="/admin?section=manage">
                  Clear selection
                </Link>
              ) : null}
            </CardHeader>
            <OpenPositionsTable
              editHrefBase="/admin?section=manage&edit="
              trades={data.openTrades}
            />
          </Card>
          {data.selectedTrade ? (
            <TradeForm disabled={previewMode} trade={data.selectedTrade} />
          ) : (
            <Card className="h-full">
              <CardHeader>
                <div className="space-y-1.5">
                  <CardTitle>Edit selected trade</CardTitle>
                  <CardDescription>
                    Choose an open position from the table to populate the editor.
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-muted-foreground">
                Use this area to revise targets, notes, or status without mixing it into the new
                trade workflow.
              </div>
            </Card>
          )}
        </section>
      ) : null}

      {activeSection === "close" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.8fr)]">
          <Card>
            <CardHeader>
              <div className="space-y-1.5">
                <CardTitle>Close tracked positions</CardTitle>
                <CardDescription>
                  Select a live signal to finalize the exit and publish the realized outcome.
                </CardDescription>
              </div>
              {params.close ? (
                <Link className={buttonStyles({ variant: "ghost", size: "sm" })} href="/admin?section=close">
                  Clear selection
                </Link>
              ) : null}
            </CardHeader>
            <OpenPositionsTable
              closeHrefBase="/admin?section=close&close="
              trades={data.openTrades}
            />
          </Card>
          <CloseTradeForm disabled={previewMode} trade={data.closeTrade} />
        </section>
      ) : null}

      {activeSection === "snapshots" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <EquitySnapshotForm disabled={previewMode} />
          <Card>
            <CardHeader>
              <div className="space-y-1.5">
                <CardTitle>Recent equity snapshots</CardTitle>
                <CardDescription>
                  The latest portfolio-level updates currently shaping the public equity curve.
                </CardDescription>
              </div>
            </CardHeader>
            {recentSnapshots.length > 0 ? (
              <div className="space-y-2.5">
                {recentSnapshots.map((snapshot) => (
                  <div
                    className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3"
                    key={snapshot.id}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatCurrency(snapshot.equity_value)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {formatDate(snapshot.snapshot_date)}
                      </p>
                    </div>
                    <p className="max-w-xs text-right text-sm leading-6 text-muted-foreground">
                      {snapshot.note || "Manual portfolio update"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-muted-foreground">
                No equity snapshots have been recorded yet.
              </div>
            )}
          </Card>
        </section>
      ) : null}
    </div>
  );
}
