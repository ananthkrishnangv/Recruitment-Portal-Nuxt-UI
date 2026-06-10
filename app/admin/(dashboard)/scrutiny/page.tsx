import { prisma } from "@/lib/db/prisma";
import { ScrutinyPanel } from "@/components/admin/ScrutinyPanel";

export default async function AdminScrutinyPage() {
  const applications = await prisma.application.findMany({
    where: {
      status: {
        in: [
          "SUBMITTED",
          "UNDER_SCRUTINY",
          "DEFICIENCY_RAISED",
          "RECOMMENDED",
          "REJECTED",
          "DIRECTOR_APPROVED",
        ],
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      applicant: { select: { name: true } },
      post: { select: { title: true } },
      documents: {
        select: {
          id: true,
          documentType: true,
          originalName: true,
          mimeType: true,
          storageKey: true,
          ocrText: true,
          ocrConfidence: true,
          verificationStatus: true,
          verificationRemarks: true,
        },
      },
      scrutinyActions: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fromStatus: true,
          toStatus: true,
          remarks: true,
          createdAt: true,
        },
      },
    },
  });

  const serialized = applications.map((app) => ({
    id: app.id,
    applicationNo: app.applicationNo,
    applicantName: app.applicant.name,
    category: app.category,
    dob: app.dob.toISOString(),
    status: app.status,
    postTitle: app.post.title,
    paymentStatus: app.paymentStatus,
    formData: (app.formData as Record<string, unknown>) ?? {},
    eligibilityResult: (app.eligibilityResult as Record<string, unknown>) ?? null,
    documents: app.documents.map((d) => ({
      ...d,
      ocrConfidence: d.ocrConfidence,
    })),
    scrutinyActions: app.scrutinyActions.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-teams-dark">
          Scrutiny Panel
        </h1>
        <p className="mt-2 text-sm text-foreground-500">
          Review applications, verify documents, and take action
        </p>
      </div>

      <ScrutinyPanel applications={serialized} />
    </div>
  );
}
