import { prisma } from "@/lib/db/prisma";
import { ColourTag } from "@/components/admin/ColourTag";
import {
  BarChart3,
  Users,
  IndianRupee,
  TrendingUp,
  Layers,
  Filter,
} from "lucide-react";

/* ═══════════════════════════════════════════════════ */
/*  CSS Bar Helper Component                           */
/* ═══════════════════════════════════════════════════ */

function HBar({
  label,
  value,
  max,
  total,
  color,
}: {
  label: string;
  value: number;
  max: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-right text-xs font-semibold text-slate-600 truncate">
        {label.replaceAll("_", " ")}
      </span>
      <div className="relative flex-1 h-7 rounded-lg bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-lg"
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

function FunnelStep({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const widthPct = total > 0 ? Math.max((value / total) * 100, 8) : 8;
  return (
    <div className="flex flex-col items-center">
      <div
        className="mx-auto flex h-12 items-center justify-center rounded-xl text-sm font-bold text-white transition-all"
        style={{
          width: `${widthPct}%`,
          backgroundColor: color,
          minWidth: "6rem",
        }}
      >
        {value}
      </div>
      <p className="mt-1.5 text-xs font-semibold text-slate-600">
        {label.replaceAll("_", " ")}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
/*  Color Maps                                         */
/* ═══════════════════════════════════════════════════ */

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

const FUNNEL_ORDER = [
  "DRAFT",
  "SUBMITTED",
  "PAYMENT_SUCCESS",
  "UNDER_SCRUTINY",
  "RECOMMENDED",
  "DIRECTOR_APPROVED",
];

const FUNNEL_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
];

/* ═══════════════════════════════════════════════════ */
/*  Page Component                                     */
/* ═══════════════════════════════════════════════════ */

export default async function AdminAnalyticsPage() {
  // ── Aggregations ──
  const totalApps = await prisma.application.count();

  const statusAgg = await prisma.application.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const statusMap: Record<string, number> = {};
  for (const s of statusAgg) statusMap[s.status] = s._count.id;

  const categoryAgg = await prisma.application.groupBy({
    by: ["category"],
    _count: { id: true },
  });
  const categoryMap: Record<string, number> = {};
  for (const c of categoryAgg) categoryMap[c.category] = c._count.id;

  // Post-wise counts
  const postAgg = await prisma.application.groupBy({
    by: ["postId"],
    _count: { id: true },
  });
  const postIds = postAgg.map((p) => p.postId);
  const posts = await prisma.recruitmentPost.findMany({
    where: { id: { in: postIds } },
    select: { id: true, title: true, postCode: true },
  });
  const postNameMap = Object.fromEntries(
    posts.map((p) => [p.id, `${p.postCode} — ${p.title}`])
  );
  const postCounts: Record<string, number> = {};
  for (const p of postAgg) {
    postCounts[postNameMap[p.postId] ?? p.postId] = p._count.id;
  }

  // Revenue
  const payments = await prisma.payment.aggregate({
    where: { status: "Success" },
    _sum: { amount: true },
    _count: { id: true },
  });
  const totalRevenue = Number(payments._sum.amount ?? 0);
  const totalPayments = payments._count.id ?? 0;

  const pendingPayments = await prisma.payment.count({
    where: { status: { not: "Success" } },
  });

  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentApps = await prisma.application.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });
  const monthlyTrend: Record<string, number> = {};
  for (const app of recentApps) {
    const key = `${app.createdAt.getFullYear()}-${String(app.createdAt.getMonth() + 1).padStart(2, "0")}`;
    monthlyTrend[key] = (monthlyTrend[key] ?? 0) + 1;
  }
  const trendEntries = Object.entries(monthlyTrend).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const maxTrend = Math.max(...trendEntries.map(([, v]) => v), 1);

  // Derived stats
  const maxStatus = Math.max(...Object.values(statusMap), 1);
  const maxCategory = Math.max(...Object.values(categoryMap), 1);
  const maxPost = Math.max(...Object.values(postCounts), 1);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-teams-dark">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-foreground-500">
          Comprehensive recruitment analytics and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Total Applications
              </p>
              <p className="heading-font text-xl font-bold text-blue-950">
                {totalApps}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <IndianRupee className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Revenue Collected
              </p>
              <p className="heading-font text-xl font-bold text-blue-950">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Successful Payments
              </p>
              <p className="heading-font text-xl font-bold text-blue-950">
                {totalPayments}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Filter className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Pending Payments
              </p>
              <p className="heading-font text-xl font-bold text-blue-950">
                {pendingPayments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Funnel */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Layers className="h-5 w-5 text-blue-700" />
          <h3 className="heading-font text-base font-bold text-blue-950">
            Application Funnel
          </h3>
        </div>
        <div className="space-y-3">
          {FUNNEL_ORDER.map((status, idx) => (
            <FunnelStep
              key={status}
              label={status}
              value={statusMap[status] ?? 0}
              total={totalApps}
              color={FUNNEL_COLORS[idx]}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-blue-700" />
            <h3 className="heading-font text-base font-bold text-blue-950">
              Category-wise Distribution
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryMap).map(([cat, count]) => (
              <HBar
                key={cat}
                label={cat}
                value={count}
                max={maxCategory}
                total={totalApps}
                color={CATEGORY_COLORS[cat] ?? "#94a3b8"}
              />
            ))}
            {Object.keys(categoryMap).length === 0 && (
              <p className="text-sm text-slate-400">No data available</p>
            )}
          </div>
        </div>

        {/* Post-wise Counts */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-emerald-700" />
            <h3 className="heading-font text-base font-bold text-blue-950">
              Post-wise Application Counts
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(postCounts).map(([post, count]) => (
              <HBar
                key={post}
                label={post}
                value={count}
                max={maxPost}
                total={totalApps}
                color="#0b63ce"
              />
            ))}
            {Object.keys(postCounts).length === 0 && (
              <p className="text-sm text-slate-400">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-5 w-5 text-blue-700" />
          <h3 className="heading-font text-base font-bold text-blue-950">
            Status Breakdown
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(statusMap).map(([status, count]) => (
            <HBar
              key={status}
              label={status}
              value={count}
              max={maxStatus}
              total={totalApps}
              color={STATUS_COLORS[status] ?? "#94a3b8"}
            />
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="h-5 w-5 text-blue-700" />
          <h3 className="heading-font text-base font-bold text-blue-950">
            Application Trend (Last 6 Months)
          </h3>
        </div>
        {trendEntries.length > 0 ? (
          <div className="flex items-end gap-4 h-48">
            {trendEntries.map(([month, count]) => {
              const heightPct = (count / maxTrend) * 100;
              const [year, m] = month.split("-");
              const label = new Date(
                Number(year),
                Number(m) - 1
              ).toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
              });
              return (
                <div
                  key={month}
                  className="flex flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-1.5 text-xs font-bold text-blue-800">
                    {count}
                  </span>
                  <div
                    className="w-full max-w-[3rem] rounded-t-lg bg-gradient-to-t from-[#073b7a] to-[#0b63ce] transition-all"
                    style={{ height: `${heightPct}%`, minHeight: "0.5rem" }}
                  />
                  <span className="mt-2 text-[10px] font-semibold text-slate-500">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No trend data available yet
          </p>
        )}
      </div>

      {/* Payment Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <IndianRupee className="h-5 w-5 text-emerald-700" />
          <h3 className="heading-font text-base font-bold text-blue-950">
            Payment Collection Summary
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-4 text-center">
            <p className="text-xs font-semibold text-emerald-600">
              Total Collected
            </p>
            <p className="heading-font mt-1 text-2xl font-bold text-emerald-900">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <p className="text-xs font-semibold text-blue-600">
              Successful Txns
            </p>
            <p className="heading-font mt-1 text-2xl font-bold text-blue-900">
              {totalPayments}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-xs font-semibold text-amber-600">
              Pending Txns
            </p>
            <p className="heading-font mt-1 text-2xl font-bold text-amber-900">
              {pendingPayments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
