import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { ColourTag } from "@/components/admin/ColourTag";
import { Card, CardContent, CardHeader, Chip } from "@/components/ui/heroui";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  FileText,
  ChevronRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // ── Fetch aggregated data ──
  const totalApps = await prisma.application.count();
  const pendingScrutiny = await prisma.application.count({
    where: { status: "UNDER_SCRUTINY" },
  });
  const approved = await prisma.application.count({
    where: { status: "RECOMMENDED" },
  });
  const rejected = await prisma.application.count({
    where: { status: "REJECTED" },
  });
  const submitted = await prisma.application.count({
    where: { status: "SUBMITTED" },
  });

  // Status counts
  const statusAgg = await prisma.application.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const statusCounts: Record<string, number> = {};
  for (const s of statusAgg) {
    statusCounts[s.status] = s._count.id;
  }

  // Category counts
  const categoryAgg = await prisma.application.groupBy({
    by: ["category"],
    _count: { id: true },
  });
  const categoryCounts: Record<string, number> = {};
  for (const c of categoryAgg) {
    categoryCounts[c.category] = c._count.id;
  }

  // Revenue estimate
  const payments = await prisma.payment.aggregate({
    where: { status: "Success" },
    _sum: { amount: true },
  });
  const revenue = Number(payments._sum.amount ?? 0);

  // Recent applications
  const recentApps = await prisma.application.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      applicant: { select: { name: true } },
      post: { select: { title: true } },
    },
  });

  // Pending deficiency count
  const deficiencyCount = await prisma.application.count({
    where: { status: "DEFICIENCY_RAISED" },
  });

  const kpiCards = [
    { label: "Total Applications", value: totalApps, icon: Users, color: "text-teams-ocean", bg: "bg-teams-ocean/10 border-teams-ocean/20" },
    { label: "Pending Scrutiny", value: pendingScrutiny, icon: Clock, color: "text-warning-600", bg: "bg-warning-50 border-warning-200" },
    { label: "Approved", value: approved, icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50 border-success-200" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "text-danger-600", bg: "bg-danger-50 border-danger-200" },
    { label: "Revenue Collected", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-teams-iris", bg: "bg-teams-iris/10 border-teams-iris/20" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-teams-dark">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-foreground-500">
          Overview of recruitment portal activity and scrutiny metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 animate-fade-in-up">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}  className={`border ${card.bg}`} style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-5 flex flex-row items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-teams-dark">
                    {card.value}
                  </p>
                  <p className="text-xs font-semibold text-foreground-600 uppercase tracking-wide mt-1">
                    {card.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <DashboardCharts
        statusCounts={statusCounts}
        categoryCounts={categoryCounts}
      />

      {/* Pending Actions & Quick Links */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts */}
        <Card  className="border border-teams-border/40">
          <CardHeader className="border-b border-teams-border/40 bg-teams-gray/30 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-teams-dark">
              Pending Actions
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {submitted > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-teams-ocean/20 bg-teams-ocean/5 p-4">
                  <FileText className="mt-0.5 h-5 w-5 text-teams-ocean shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-teams-dark">
                      {submitted} new submission(s)
                    </p>
                    <p className="text-xs text-foreground-600 mt-1">
                      Awaiting initial review
                    </p>
                  </div>
                </div>
              )}
              {deficiencyCount > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-danger shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-teams-dark">
                      {deficiencyCount} deficiency raised
                    </p>
                    <p className="text-xs text-foreground-600 mt-1">
                      Pending applicant response
                    </p>
                  </div>
                </div>
              )}
              {pendingScrutiny > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4">
                  <Clock className="mt-0.5 h-5 w-5 text-warning-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-teams-dark">
                      {pendingScrutiny} under scrutiny
                    </p>
                    <p className="text-xs text-foreground-600 mt-1">
                      Need review completion
                    </p>
                  </div>
                </div>
              )}
              {submitted === 0 &&
                deficiencyCount === 0 &&
                pendingScrutiny === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 size={32} className="mx-auto text-success-400 mb-3" />
                    <p className="text-sm font-semibold text-foreground-600">
                      No pending actions. All caught up!
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card  className="border border-teams-border/40 lg:col-span-2">
          <CardHeader className="border-b border-teams-border/40 bg-teams-gray/30 px-6 py-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-teams-dark">
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Button href="/admin/applications" variant="ghost" className="h-14 justify-between bg-teams-gray/20 hover:bg-teams-gray/40 border border-teams-border/40 font-semibold" icon={<ChevronRight size={18} className="text-teams-ocean" />}>
                View Applications
              </Button>
              <Button href="/admin/scrutiny" variant="ghost" className="h-14 justify-between bg-teams-gray/20 hover:bg-teams-gray/40 border border-teams-border/40 font-semibold" icon={<ChevronRight size={18} className="text-teams-ocean" />}>
                Scrutiny Dashboard
              </Button>
              <Button href="/admin/vacancies" variant="ghost" className="h-14 justify-between bg-teams-gray/20 hover:bg-teams-gray/40 border border-teams-border/40 font-semibold" icon={<ChevronRight size={18} className="text-teams-ocean" />}>
                Manage Vacancies
              </Button>
              <Button href="/admin/settings" variant="ghost" className="h-14 justify-between bg-teams-gray/20 hover:bg-teams-gray/40 border border-teams-border/40 font-semibold" icon={<ChevronRight size={18} className="text-teams-ocean" />}>
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card  className="border border-teams-border/40">
        <CardHeader className="border-b border-teams-border/40 bg-teams-gray/30 px-6 py-4 flex flex-col items-start gap-1">
          <h3 className="text-sm font-bold tracking-widest uppercase text-teams-dark">
            Recent Applications
          </h3>
          <p className="text-xs text-foreground-500">
            Last 10 applications received
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-teams-gray/10 border-b border-teams-border/40">
                  <th className="px-6 py-4 font-bold text-foreground-500 uppercase text-xs tracking-wider">Application No</th>
                  <th className="px-6 py-4 font-bold text-foreground-500 uppercase text-xs tracking-wider">Applicant</th>
                  <th className="px-6 py-4 font-bold text-foreground-500 uppercase text-xs tracking-wider">Post</th>
                  <th className="px-6 py-4 font-bold text-foreground-500 uppercase text-xs tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold text-foreground-500 uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-foreground-500 uppercase text-xs tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teams-border/20">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-teams-gray/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-teams-dark">
                      {app.applicationNo}
                    </td>
                    <td className="px-6 py-4 font-medium text-teams-dark">{app.applicant.name}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-foreground-600">
                      {app.post.title}
                    </td>
                    <td className="px-6 py-4">
                      <ColourTag value={app.category} />
                    </td>
                    <td className="px-6 py-4">
                      <ColourTag value={app.status} />
                    </td>
                    <td className="px-6 py-4 text-foreground-500 text-xs font-medium">
                      {formatDate(app.submittedAt)}
                    </td>
                  </tr>
                ))}
                {recentApps.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-foreground-400 font-medium"
                    >
                      No applications found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
