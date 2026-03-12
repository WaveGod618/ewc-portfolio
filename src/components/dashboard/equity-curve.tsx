"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency, formatDate } from "@/lib/formatters";
import type { EquityPoint } from "@/lib/types";

export function EquityCurve({ data }: { data: EquityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[290px] min-w-0 items-center justify-center rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 text-sm text-muted-foreground">
        Add equity snapshots or close trades with position sizing to populate the curve.
      </div>
    );
  }

  const values = data.map((point) => point.equity);
  const minEquity = Math.min(...values);
  const maxEquity = Math.max(...values);
  const rawRange = maxEquity - minEquity;
  const visualPadding = Math.max(rawRange * 0.18, maxEquity * 0.008, 250);
  const chartMin = Math.max(0, Math.floor((minEquity - visualPadding) / 100) * 100);
  const chartMax = Math.ceil((maxEquity + visualPadding) / 100) * 100;

  return (
    <div className="h-[290px] min-h-[290px] min-w-0 w-full">
      <ResponsiveContainer height="100%" minHeight={290} minWidth={240} width="100%">
        <AreaChart data={data} margin={{ top: 12, right: 10, left: 6, bottom: 6 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
            interval="preserveStartEnd"
            minTickGap={24}
            padding={{ left: 14, right: 14 }}
            tick={{ fill: "rgba(148, 163, 184, 0.88)", fontSize: 13 }}
            tickFormatter={(value) => formatDate(value)}
            tickLine={false}
            tickMargin={12}
          />
          <YAxis
            axisLine={false}
            domain={[chartMin, chartMax]}
            tick={{ fill: "rgba(148, 163, 184, 0.88)", fontSize: 13 }}
            tickCount={5}
            tickFormatter={(value) => formatCurrency(Number(value))}
            tickLine={false}
            tickMargin={10}
            width={112}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              color: "#f8fafc",
            }}
            formatter={(value) =>
              formatCurrency(typeof value === "number" ? value : Number(value ?? 0))
            }
            labelFormatter={(value) => formatDate(String(value))}
          />
          <Area
            dataKey="equity"
            fill="url(#equityGradient)"
            stroke="#38bdf8"
            strokeWidth={2.5}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
