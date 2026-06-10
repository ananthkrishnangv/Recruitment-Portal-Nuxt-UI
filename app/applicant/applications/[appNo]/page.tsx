import { Button } from "@/components/ui/button";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { ColourTag } from "@/components/admin/ColourTag";
import { uploadVaultDocument } from "@/app/actions/documents";
import { Card, CardContent, CardHeader, Input, Select, SelectItem } from "@/components/ui/heroui";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Shield,
  Upload,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

/* ── Status timeline configuration ── */
const STATUS_FLOW = [
  { key: "DRAFT", label: "Draft Created", icon: Circle },
  { key: "SUBMITTED", label: "Submitted & Locked", icon: CheckCircle2 },
  { key: "PAYMENT_PENDING", label: "Payment Pending", icon: CreditCard },
  { key: "PAYMENT_SUCCESS", label: "Payment Received", icon: CreditCard },
  { key: "UNDER_SCRUTINY", label: "Under Scrutiny", icon: Clock },
  { key: "DEFICIENCY_RAISED", label: "Deficiency Raised", icon: AlertTriangle },
  { key: "RECOMMENDED", label: "Recommended", icon: CheckCircle2 },
  { key: "DIRECTOR_APPROVED", label: "Director Approved", icon: Shield },
];

function getStatusIndex(status: string): number {
  const idx = STATUS_FLOW.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ appNo: string }>;
}) {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  const { appNo } = await params;

  const application = await prisma.application.findUnique({
    where: { applicationNo: appNo },
    include: {
      post: true,
      documents: { orderBy: { uploadedAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
      scrutinyActions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!application || application.applicantId !== user.id) notFound();

  const currentStepIndex = getStatusIndex(application.status);
  const formData =
    (application.formData as Record<string, unknown> | null) ?? {};

  /* ── Document type list for deficiency uploads ── */
  const docTypes = [
    "Photo",
    "Signature",
    "DOB Proof",
    "Community Certificate",
    "Educational Certificate",
    "Experience Certificate",
    "PwBD Certificate",
    "Other",
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Back navigation */}
      <Button
        href="/applicant/applications"
        variant="ghost"
        size="sm"
        icon={<ArrowLeft size={16} />}
        className="font-bold text-foreground-500 hover:text-teams-dark"
      >
        Back to Applications
      </Button>

      {/* ── Header ── */}
      <Card  className="border border-teams-border/40">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-teams-dark">
                {application.applicationNo}
              </h1>
              <p className="mt-1 text-base font-semibold text-foreground-600">{application.post.title}</p>
              <p className="mt-1 text-xs font-medium text-foreground-400">
                Post Code: {application.post.postCode} &middot; Adv.
                No.: {application.post.advertisementNo}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ColourTag value={application.category} />
              <ColourTag value={application.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main content (2 cols) ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ── Form Data Summary ── */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                Application Data
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-500">
                    Category
                  </p>
                  <p className="mt-1 font-bold text-teams-dark">
                    {application.category}
                  </p>
                </div>

                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-500">
                    Date of Birth
                  </p>
                  <p className="mt-1 font-bold text-teams-dark">
                    {formatDate(application.dob)}
                  </p>
                </div>

                <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-500">
                    Submitted At
                  </p>
                  <p className="mt-1 font-bold text-teams-dark">
                    {application.submittedAt
                      ? formatDate(application.submittedAt)
                      : "Not yet submitted"}
                  </p>
                </div>

                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground-500">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="mt-1 font-bold text-teams-dark">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>

              {application.finalHash && (
                <div className="mt-6 rounded-xl border border-success-200 bg-success-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-success-700">
                    Integrity Hash (SHA-256)
                  </p>
                  <p className="mt-1 break-all font-mono text-sm font-semibold text-success-900">
                    {application.finalHash}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Document Checklist ── */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                Document Checklist
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              {application.documents.length > 0 ? (
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-teams-border/20">
                          <FileText className="h-5 w-5 text-teams-ocean" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-teams-dark">
                            {doc.documentType}
                          </p>
                          <p className="text-xs font-medium text-foreground-500">
                            {doc.originalName} &middot;{" "}
                            {(doc.sizeBytes / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <ColourTag value={doc.verificationStatus} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-8 text-center">
                  <FileText className="mx-auto h-10 w-10 text-foreground-300" />
                  <p className="mt-2 text-sm font-medium text-foreground-500">
                    No documents attached to this application yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Scrutiny Remarks ── */}
          {application.scrutinyActions.length > 0 && (
            <Card  className="border border-teams-border/40">
              <CardHeader className="flex items-center gap-3 p-6 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teams-ocean/10">
                  <MessageSquare className="h-5 w-5 text-teams-ocean" />
                </div>
                <h2 className="text-xl font-bold text-teams-dark">
                  Scrutiny Remarks
                </h2>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="space-y-4">
                  {application.scrutinyActions.map((action) => (
                    <div
                      key={action.id}
                      className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ColourTag value={action.fromStatus} />
                          <span className="text-xs font-bold text-foreground-300">&rarr;</span>
                          <ColourTag value={action.toStatus} />
                        </div>
                        <span className="text-xs font-semibold text-foreground-500">
                          {formatDate(action.createdAt)}
                        </span>
                      </div>
                      {action.remarks && (
                        <p className="mt-3 text-sm font-medium text-teams-dark bg-white p-3 rounded-lg border border-teams-border/20 shadow-sm">
                          {action.remarks}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Deficiency Response Form ── */}
          {application.status === "DEFICIENCY_RAISED" && (
            <Card  className="border border-danger/30 bg-danger-50/50">
              <CardHeader className="flex items-center gap-3 p-6 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-danger-800">
                    Respond to Deficiency
                  </h2>
                  <p className="text-xs font-medium text-danger-700/80 mt-1">
                    Upload additional or corrected documents to address the scrutiny remarks.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <form action={uploadVaultDocument} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Select
                      name="documentType"
                      label="Document Type"
                      placeholder="Select type"
                      variant="bordered"
                      labelPlacement="outside"
                      isRequired
                      classNames={{ trigger: "bg-white border-danger/20" }}
                    >
                      {docTypes.map((t) => (
                        <SelectItem id={t} key={t} textValue={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </Select>
                    
                    <div className="flex flex-col justify-end">
                      <Input
                        alt="file"
                        type="file"
                        variant="bordered"
                        accept="application/pdf,image/png,image/jpeg,image/webp"
                        isRequired
                        classNames={{ inputWrapper: "bg-white border-danger/20" }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="danger" className="font-bold shadow-sm" icon={<Upload size={16} />}>
                      Upload Document
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar (1 col) ── */}
        <div className="space-y-6">
          {/* ── Status Timeline ── */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="p-6 pb-2">
              <h2 className="text-xl font-bold text-teams-dark">
                Timeline
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="relative ml-5 border-l-2 border-teams-border/40 pl-6 py-2">
                {STATUS_FLOW.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <div key={step.key} className="relative mb-6 last:mb-0">
                      {/* Circle dot */}
                      <div
                        className={`absolute -left-[calc(1.5rem+9px)] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
                          isCompleted
                            ? isCurrent
                              ? "border-teams-ocean bg-teams-ocean"
                              : "border-success bg-success"
                            : "border-teams-border/60 bg-white"
                        }`}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>

                      <div className={`${isCurrent ? "rounded-xl bg-teams-ocean/5 border border-teams-ocean/20 p-3 -ml-3 -mt-2 shadow-sm" : ""}`}>
                        <p
                          className={`text-sm font-bold ${
                            isCompleted
                              ? isCurrent
                                ? "text-teams-ocean"
                                : "text-success-600"
                              : "text-foreground-400"
                          }`}
                        >
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 rounded-full bg-teams-ocean px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                              CURRENT
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* ── Payment Info ── */}
          <Card  className="border border-teams-border/40">
            <CardHeader className="flex items-center gap-3 p-6 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teams-ocean/10">
                <CreditCard className="h-5 w-5 text-teams-ocean" />
              </div>
              <h2 className="text-xl font-bold text-teams-dark">
                Payments
              </h2>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              {application.payments.length > 0 ? (
                <div className="space-y-3">
                  {application.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4"
                    >
                      <div>
                        <p className="text-base font-bold text-teams-dark">
                          ₹{Number(p.amount).toFixed(2)}
                        </p>
                        <p className="text-xs font-semibold text-foreground-500 mt-0.5">
                          Ref: {p.gatewayRef}
                        </p>
                      </div>
                      <div className="text-right">
                        <ColourTag value={p.status} />
                        {p.paidAt && (
                          <p className="mt-1 text-xs font-medium text-foreground-400">
                            {formatDate(p.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-6 text-center">
                  <p className="text-sm font-medium text-foreground-500">
                    No payment transactions found.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Download PDF ── */}
          {application.status !== "DRAFT" && (
            <Card  className="border border-teams-border/40 bg-teams-gray/10">
              <CardContent className="p-6 text-center">
                <Download className="mx-auto h-10 w-10 text-teams-ocean/50" />
                <h3 className="mt-3 text-lg font-bold text-teams-dark">
                  Download Application
                </h3>
                <p className="mt-1 text-xs font-medium text-foreground-500 mb-4">
                  PDF generation will be available once the portal report module is configured.
                </p>
                <Button variant="ghost" size="sm" className="font-bold bg-teams-ocean/10 text-teams-ocean" isDisabled startContent={<Download size={16} />}>
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
