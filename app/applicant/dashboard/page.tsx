import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { ColourTag } from "@/components/admin/ColourTag";
import { Card, CardContent, CardHeader, CardFooter, Avatar } from "@/components/ui/heroui";
import {
  PlusCircle,
  FolderOpen,
  Search,
  UserCog,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  Eye,
  Activity,
  ArrowRight
} from "lucide-react";

export default async function ApplicantDashboard() {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  /* ── Fetch data ── */
  const applications = await prisma.application.findMany({
    where: { applicantId: user.id },
    include: { post: true, scrutinyActions: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { updatedAt: "desc" },
  });

  const totalApps = applications.length;
  const submitted = applications.filter((a) => a.status === "SUBMITTED").length;
  const underReview = applications.filter(
    (a) => a.status === "UNDER_SCRUTINY" || a.status === "DEFICIENCY_RAISED"
  ).length;
  const drafts = applications.filter((a) => a.status === "DRAFT").length;

  const deficiencyApps = applications.filter(
    (a) => a.status === "DEFICIENCY_RAISED"
  );

  /* Gather recent scrutiny actions across all apps */
  const recentActions = applications
    .flatMap((a) =>
      a.scrutinyActions.map((sa) => ({
        ...sa,
        applicationNo: a.applicationNo,
        postTitle: a.post.title,
      }))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  /* ── Stats config ── */
  const stats = [
    {
      label: "Total Applications",
      value: totalApps,
      icon: FileText,
      color: "text-blue-700",
      bg: "bg-blue-100",
    },
    {
      label: "Submitted",
      value: submitted,
      icon: Send,
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    },
    {
      label: "Under Review",
      value: underReview,
      icon: Eye,
      color: "text-amber-700",
      bg: "bg-amber-100",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: Clock,
      color: "text-slate-600",
      bg: "bg-slate-200",
    },
  ];

  /* ── Quick actions ── */
  const quickActions = [
    {
      href: "/applicant/apply",
      icon: PlusCircle,
      title: "Start New Application",
      description: "Browse active posts and apply",
      color: "text-teams-ocean",
      bg: "bg-teams-ocean/10",
    },
    {
      href: "/applicant/documents",
      icon: FolderOpen,
      title: "Document Vault",
      description: "Upload & manage certificates",
      color: "text-success-600",
      bg: "bg-success/10",
    },
    {
      href: "/applicant/applications",
      icon: Search,
      title: "Check Status",
      description: "Track application ProgressBar",
      color: "text-warning-600",
      bg: "bg-warning/10",
    },
    {
      href: "/applicant/profile",
      icon: UserCog,
      title: "Update Profile",
      description: "Edit personal information",
      color: "text-secondary-600",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* ── Welcome Card ── */}
      <section className="rounded-2xl bg-gradient-to-r from-teams-dark to-teams-ocean p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <Avatar 
            alt={user.name} 
            className="w-20 h-20 text-xl font-bold bg-white text-teams-ocean border-4 border-white/20 shadow-xl"
          />
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-white/80 font-medium">
              Last login: {formatDate(user.updatedAt)} &middot; Manage your applications and documents from here.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}  className="border border-teams-border/40">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                    <Icon className={`h-6 w-6 ${s.color}`} />
                  </div>
                  <span className="text-3xl font-bold text-teams-dark">
                    {s.value}
                  </span>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-foreground-500">
                  {s.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Column ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ── Deficiency Alerts ── */}
          {deficiencyApps.length > 0 && (
            <Card  className="border border-danger/30 bg-danger-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-6 w-6 text-danger" />
                  <h2 className="text-xl font-bold text-danger-800">
                    Deficiency Alerts
                  </h2>
                </div>
                <p className="text-sm text-danger-700/80 mb-4 font-medium">
                  The following applications require your attention. Please respond to the deficiency remarks at the earliest.
                </p>

                <div className="space-y-3">
                  {deficiencyApps.map((app) => (
                    <Link
                      key={app.id}
                      href={`/applicant/applications/${app.applicationNo}`}
                      className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md border border-danger/20"
                    >
                      <div>
                        <p className="font-bold text-danger-900">
                          {app.applicationNo}
                        </p>
                        <p className="text-xs font-medium text-danger-700/70 mt-1">
                          {app.post.title}
                        </p>
                      </div>
                      <ColourTag value="DEFICIENCY_RAISED" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── My Applications ── */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                My Applications
              </h2>
              <Button  href="/applicant/applications" variant="primary" size="sm" icon={<ArrowRight size={16} />}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <Link
                    key={app.id}
                    href={`/applicant/applications/${app.applicationNo}`}
                    className="group flex flex-col gap-4 rounded-xl bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30 border border-teams-border/30 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-teams-ocean text-lg">
                        {app.applicationNo}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground-600">
                        {app.post.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <ColourTag value={app.status} />
                      {app.submittedAt && (
                        <span className="text-xs font-medium text-foreground-400">
                          {formatDate(app.submittedAt)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}

                {applications.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-10 text-center">
                    <FileText className="mx-auto h-12 w-12 text-foreground-300" />
                    <p className="mt-4 text-base font-bold text-foreground-600">
                      No applications yet
                    </p>
                    <p className="mt-1 text-sm text-foreground-400 mb-6">
                      Start by browsing available posts and creating your first application.
                    </p>
                    <Button  href="/applicant/apply" variant="primary" className="font-bold bg-teams-ocean shadow-md">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Apply for a Post
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar Column ── */}
        <div className="space-y-6">
          {/* ── Quick Actions ── */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                Quick Actions
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {quickActions.map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <Link
                      key={qa.href}
                      href={qa.href}
                      className="group flex items-center gap-4 rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4 transition hover:border-teams-ocean/30 hover:bg-teams-ocean/5"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${qa.bg} transition group-hover:scale-110`}>
                        <Icon className={`h-6 w-6 ${qa.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-teams-dark text-sm">
                          {qa.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-foreground-500">
                          {qa.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Recent Activity ── */}
          {recentActions.length > 0 && (
            <Card  className="border border-teams-border/40">
              <CardHeader className="flex items-center gap-2 p-6 pb-2">
                <Activity className="h-5 w-5 text-teams-ocean" />
                <h2 className="text-xl font-bold text-teams-dark">
                  Recent Activity
                </h2>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="space-y-5">
                  {recentActions.map((action) => (
                    <div
                      key={action.id}
                      className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:h-full before:w-[2px] before:bg-teams-border/60 last:before:hidden"
                    >
                      <div className="absolute left-0 top-1.5 h-[24px] w-[24px] rounded-full bg-teams-gray/50 border-2 border-teams-ocean/40 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-teams-ocean" />
                      </div>
                      <div className="ml-2">
                        <p className="text-sm text-teams-dark">
                          <span className="font-bold">
                            {action.applicationNo}
                          </span>{" "}
                          &mdash;{" "}
                          <span className="text-foreground-500 font-medium">
                            {action.fromStatus.replaceAll("_", " ")}
                          </span>{" "}
                          &rarr;{" "}
                          <span className="font-bold text-teams-ocean">
                            {action.toStatus.replaceAll("_", " ")}
                          </span>
                        </p>
                        {action.remarks && (
                          <div className="mt-2 rounded-lg bg-teams-gray/20 p-3 text-xs italic text-foreground-600 border border-teams-border/40">
                            &ldquo;{action.remarks}&rdquo;
                          </div>
                        )}
                        <p className="mt-1.5 text-xs font-semibold text-foreground-400">
                          {formatDate(action.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

