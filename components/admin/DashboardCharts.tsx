"use client";

import { useEffect, useRef, useState } from "react";

interface ChartData {
  statusCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  SUBMITTED: "#3b82f6",
  PAYMENT_PENDING: "#f97316",
  PAYMENT_SUCCESS: "#10b981",
  UNDER_SCRUTINY: "#f59e0b",
  DEFICIENCY_RAISED: "#f43f5e",
  RECOMMENDED: "#22c55e",
  REJECTED: "#ef4444",
  DIRECTOR_APPROVED: "#14b8a6",
  LOCKED: "#475569",
};

const CATEGORY_COLORS: Record<string, string> = {
  UR: "#64748b",
  OBC: "#6366f1",
  SC: "#a855f7",
  ST: "#d946ef",
  EWS: "#06b6d4",
  PwBD: "#14b8a6",
};

function AnimatedBar({
  label,
  value,
  maxValue,
  color,
  total,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  total: number;
}) {
  const [width, setWidth] = useState(0);
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(maxValue > 0 ? (value / maxValue) * 100 : 0);
    }, 100);
    return () => clearTimeout(timeout);
  }, [value, maxValue]);

  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-right text-xs font-semibold text-slate-600 truncate">
        {label.replaceAll("_", " ")}
      </span>
      <div className="flex-1 h-7 rounded-lg bg-slate-100 overflow-hidden relative">
        <div
          className="h-full rounded-lg transition-all duration-700 ease-out"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            minWidth: value > 0 ? "2rem" : "0",
          }}
        />
        <span className="absolute inset-0 flex items-center px-3 text-xs font-bold text-slate-700">
          {value > 0 && `${value} (${pct}%)`}
        </span>
      </div>
    </div>
  );
}

export function DashboardCharts({ statusCounts, categoryCounts }: ChartData) {
  const statusEntries = Object.entries(statusCounts);
  const categoryEntries = Object.entries(categoryCounts);
  const maxStatus = Math.max(...statusEntries.map(([, v]) => v), 1);
  const maxCategory = Math.max(...categoryEntries.map(([, v]) => v), 1);
  const totalStatus = statusEntries.reduce((s, [, v]) => s + v, 0);
  const totalCategory = categoryEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Applications by Status */}
      <div className="glass-card p-6">
        <h3 className="heading-font mb-5 text-base font-bold text-blue-950">
          Applications by Status
        </h3>
        <div className="space-y-3">
          {statusEntries.map(([status, count]) => (
            <AnimatedBar
              key={status}
              label={status}
              value={count}
              maxValue={maxStatus}
              color={STATUS_COLORS[status] ?? "#94a3b8"}
              total={totalStatus}
            />
          ))}
          {statusEntries.length === 0 && (
            <p className="text-sm text-slate-400">No data available</p>
          )}
        </div>
      </div>

      {/* Applications by Category */}
      <div className="glass-card p-6">
        <h3 className="heading-font mb-5 text-base font-bold text-blue-950">
          Applications by Category
        </h3>
        <div className="space-y-3">
          {categoryEntries.map(([category, count]) => (
            <AnimatedBar
              key={category}
              label={category}
              value={count}
              maxValue={maxCategory}
              color={CATEGORY_COLORS[category] ?? "#94a3b8"}
              total={totalCategory}
            />
          ))}
          {categoryEntries.length === 0 && (
            <p className="text-sm text-slate-400">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
