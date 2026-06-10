import { prisma } from "@/lib/db/prisma";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      applicant: { select: { name: true } },
      post: { select: { title: true } },
    },
  });

  const rows = applications.map((app) => ({
    id: app.id,
    applicationNo: app.applicationNo,
    applicant: { name: app.applicant.name },
    post: { title: app.post.title },
    category: app.category,
    status: app.status,
    paymentStatus: app.paymentStatus,
    submittedAt: app.submittedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-teams-dark">
          Applications
        </h1>
        <p className="mt-2 text-sm text-foreground-500">
          Manage and review all recruitment applications
        </p>
      </div>

      <ApplicationsTable applications={rows} />
    </div>
  );
}
