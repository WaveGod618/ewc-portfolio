import Link from "next/link";

import { DisclaimerCard } from "@/components/dashboard/disclaimer-card";
import { ClosedTradesTable } from "@/components/trades/closed-trades-table";
import { TradeFilters } from "@/components/trades/trade-filters";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicModelData } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    ticker?: string;
    direction?: string;
  }>;
};

export default async function HistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const ticker = params.ticker?.trim().toUpperCase() ?? "";
  const direction = params.direction?.trim().toLowerCase() ?? "all";
  const data = await getPublicModelData();

  const filteredTrades = data.closedTrades.filter((trade) => {
    const matchesTicker = ticker ? trade.ticker.includes(ticker) : true;
    const matchesDirection = direction === "all" ? true : trade.direction === direction;
    return matchesTicker && matchesDirection;
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] px-6 py-10 shadow-[0_24px_90px_rgba(2,6,16,0.45)] sm:px-8 sm:py-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/78">
          Closed Trades
        </p>
        <h1 className="font-heading mt-4 text-[3rem] font-semibold leading-none tracking-[-0.06em] text-foreground sm:text-[4rem]">
          Completed signal history
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          A public ledger of completed EWC trade signals with long and short attribution,
          direction-aware performance results, and clean historical timestamps.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-muted-foreground">
            Showing {filteredTrades.length} completed trades
          </div>
          <Link className={buttonStyles({ variant: "secondary", size: "sm" })} href="/">
            Back to dashboard
          </Link>
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle>Closed-trade ledger</CardTitle>
            <CardDescription>
              Based on posted EWC trade alerts.
            </CardDescription>
          </div>
          <div className="w-full max-w-[430px]">
            <TradeFilters action="/history" direction={direction} ticker={ticker} />
          </div>
        </CardHeader>
        <ClosedTradesTable trades={filteredTrades} />
      </Card>

      <DisclaimerCard text={data.settings.disclaimer_text} />
    </div>
  );
}
