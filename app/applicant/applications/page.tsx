import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { ColourTag } from "@/components/admin/ColourTag";
import { submitApplication } from "@/app/actions/applications";
import { FileText, Send, PlusCircle } from "lucide-react";
import { Card, CardContent, Tabs, Tab } from "@/components/ui/heroui";

export default async function ApplicationsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  const params = await searchParams;
  const statusFilter = params.status ?? "all";

  /* ── Query ── */
  const where: Record<string, unknown> = { applicantId: user.id };
  if (statusFilter !== "all") {
    where.status = statusFilter;
  }

  const applications = await prisma.application.findMany({
    where,
    include: { post: true },
    orderBy: { updatedAt: "desc" },
  });

  /* ── Filter tabs ── */
  const tabs = [
    { key: "all", label: "All" },
    { key: "DRAFT", label: "Draft" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "UNDER_SCRUTINY", label: "Under Review" },
    { key: "DEFICIENCY_RAISED", label: "Deficiency" },
    { key: "RECOMMENDED", label: "Recommended" },
    { key: "DIRECTOR_APPROVED", label: "Approved" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-teams-gray/20 p-6 rounded-xl border border-teams-border/40">
        <div>
          <h1 className="text-3xl font-bold text-teams-dark">
            My Applications
          </h1>
          <p className="mt-1 text-sm font-medium text-foreground-500">
            View and manage all your recruitment applications.
          </p>
        </div>
        <Button  href="/applicant/apply" variant="primary" className="font-bold bg-teams-ocean shadow-md" icon={<PlusCircle size={18} />}>
          New Application
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-teams-border/40 p-2 overflow-x-auto hide-scrollbar">
        <Tabs 
          selectedKey={statusFilter}
          variant="primary"
          classNames={{
            tabList: "gap-2 w-full",
            cursor: "w-full bg-teams-ocean/10 border border-teams-ocean/20",
            tab: "max-w-fit px-4 h-9",
            tabContent: "group-data-[selected=true]:text-teams-ocean font-bold text-foreground-500"
          }}
        >
          {tabs.map((tab) => (
            <Tab 
              key={tab.key} 
              title={tab.label} 
              href={`/applicant/applications${tab.key === "all" ? "" : `?status=${tab.key}`}`}
            />
          ))}
        </Tabs>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id}  className="border border-teams-border/40 hover:bg-teams-gray/10 transition-colors animate-fade-in-up">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Left side info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teams-gray/50 border border-teams-border/40">
                      <FileText className="h-6 w-6 text-teams-ocean" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-teams-dark">
                        {app.applicationNo}
                      </p>
                      <p className="truncate text-sm font-medium text-foreground-500 mt-0.5">
                        {app.post.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3">
                  <ColourTag value={app.category} />
                  <ColourTag value={app.status} />

                  <div className="bg-teams-gray/20 border border-teams-border/40 px-3 py-1 rounded-full text-xs font-semibold text-foreground-500">
                    {app.submittedAt ? (
                      <span>Submitted: {formatDate(app.submittedAt)}</span>
                    ) : (
                      <span>Updated: {formatDate(app.updatedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3 border-t md:border-t-0 md:border-l border-teams-border/30 pt-4 md:pt-0 md:pl-4">
                  <Button
                    
                    href={`/applicant/applications/${app.applicationNo}`}
                    variant="primary"
                    size="sm"
                    className="font-bold text-teams-ocean bg-teams-ocean/10"
                  >
                    View Details
                  </Button>

                  {app.status === "DRAFT" && (
                    <form
                      action={async () => {
                        "use server";
                        await submitApplication(app.applicationNo);
                      }}
                    >
                      <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        className="font-bold text-white shadow-sm"
                        icon={<Send size={16} />}
                      >
                        Submit
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-12 text-center animate-fade-in">
            <FileText className="mx-auto h-12 w-12 text-foreground-300" />
            <h3 className="mt-4 text-xl font-bold text-teams-dark">
              No Applications Found
            </h3>
            <p className="mt-2 text-sm text-foreground-500 font-medium">
              {statusFilter !== "all"
                ? `No applications with status "${statusFilter.replaceAll("_", " ")}".`
                : "You haven't started any applications yet."}
            </p>
            <Button  href="/applicant/apply" variant="primary" className="mt-6 font-bold bg-teams-ocean shadow-md">
              Browse Available Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

