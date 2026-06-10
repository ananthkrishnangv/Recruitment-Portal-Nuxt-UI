import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { acceptDpdpConsent } from "@/app/actions/consent";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, Checkbox, Chip } from "@/components/ui/heroui";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default async function ConsentPage() {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  const notice = await prisma.consentNotice.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  const records = await prisma.consentRecord.findMany({
    where: { userId: user.id },
    include: { notice: true },
    orderBy: { createdAt: "desc" },
  });

  const hasAcceptedCurrent = records.some(
    (r) => r.accepted && notice && r.noticeId === notice.id
  );

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <section className="glass-card p-6 bg-teams-gray/20 border border-teams-border/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 border border-success/20">
            <ShieldCheck size={24} className="text-success-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teams-dark">
              DPDP Consent Notice
            </h1>
            <p className="mt-1 text-sm font-medium text-foreground-500">
              Digital Personal Data Protection Act, 2023 compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Current Consent Status */}
      {hasAcceptedCurrent ? (
        <Card  className="border border-success-200 bg-success-50/50">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle2 size={24} className="text-success-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-success-800">
                  Consent Accepted
                </h2>
                <p className="mt-1 text-sm font-medium text-success-700/80 leading-relaxed">
                  You have accepted the current consent notice
                  {notice ? ` (Version ${notice.version})` : ""}. Your consent was
                  recorded on <span className="font-bold">{formatDate(user.consentAt)}</span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card  className="border border-warning-200 bg-warning-50/50">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle size={24} className="text-warning-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-warning-800">
                  Consent Required
                </h2>
                <p className="mt-1 text-sm font-medium text-warning-700/80 leading-relaxed">
                  Please review and accept the consent notice below to continue using
                  the portal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consent Notice Content */}
      <Card  className="border border-teams-border/40">
        <CardHeader className="flex items-center gap-3 p-6 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teams-ocean/10">
            <FileText className="h-5 w-5 text-teams-ocean" />
          </div>
          <h2 className="text-xl font-bold text-teams-dark">
            {notice?.title ?? "Consent Notice Not Configured"}
          </h2>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {notice ? (
            <>
              <div className="rounded-xl border border-teams-border/30 bg-teams-gray/10 p-6">
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-foreground-700">
                    {notice.body}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Chip size="sm" variant="ghost" color="default" className="font-bold">
                  Version: {notice.version}
                </Chip>
                <Chip size="sm" variant="ghost" color="default" className="font-bold">
                  Language: {notice.language.toUpperCase()}
                </Chip>
                <Chip size="sm" variant="ghost" color="default" className="font-bold text-foreground-500">
                  Published: {formatDate(notice.createdAt)}
                </Chip>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-12 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-foreground-300" />
              <p className="mt-4 text-base font-bold text-teams-dark">
                No active consent notice has been configured by the administrator.
              </p>
              <p className="mt-1 text-sm font-medium text-foreground-500">
                Please check back later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acceptance Form */}
      {notice && !hasAcceptedCurrent && (
        <Card  className="border border-teams-border/40">
          <CardHeader className="p-6 pb-2">
            <h2 className="text-xl font-bold text-teams-dark">
              Provide Your Consent
            </h2>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <form action={acceptDpdpConsent} className="space-y-6">
              <input
                type="hidden"
                alt="purpose"
                value="Recruitment application processing, eligibility validation, scrutiny, audit and communication"
              />

              <div className="rounded-xl border border-teams-ocean/20 bg-teams-ocean/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-teams-ocean mb-3">
                  Data Processing Purposes
                </p>
                <ul className="space-y-2.5 text-sm font-medium text-foreground-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teams-ocean" />
                    Processing your recruitment application and verifying eligibility
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teams-ocean" />
                    Scrutiny of submitted documents and qualifications
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teams-ocean" />
                    Communication regarding application status and deficiencies
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teams-ocean" />
                    Maintaining audit trail as per government regulations
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teams-ocean" />
                    Local-only Aadhaar storage (not authenticated with UIDAI)
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-teams-border/30 bg-white p-5 shadow-sm transition hover:border-teams-border/50">
                <Checkbox 
                  alt="accepted" 
                  isRequired 
                  
                  classNames={{ 
                    label: "text-sm font-bold text-teams-dark leading-relaxed ml-2",
                    wrapper: "mt-1"
                  }}
                >
                  I have read and understood the consent notice above. I hereby
                  consent to the processing of my personal data for the stated
                  recruitment purposes in accordance with the Digital Personal Data
                  Protection Act, 2023.
                </Checkbox>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="font-bold text-white shadow-md px-6"
                  icon={<ShieldCheck size={18} />}
                >
                  Record Consent
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Consent History */}
      <Card  className="border border-teams-border/40">
        <CardHeader className="flex items-center gap-3 p-6 pb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teams-gray/20">
            <Clock className="h-5 w-5 text-teams-dark" />
          </div>
          <h2 className="text-xl font-bold text-teams-dark">
            Consent History
          </h2>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {records.length > 0 ? (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-teams-dark">
                        Version {record.notice.version}
                      </span>
                      {record.accepted ? (
                        <Chip variant="primary" size="sm" variant="ghost" className="font-bold border border-success/20">
                          Accepted
                        </Chip>
                      ) : (
                        <Chip variant="danger" size="sm" variant="ghost" className="font-bold border border-danger/20">
                          Rejected
                        </Chip>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs font-medium text-foreground-500">
                      <span className="font-bold text-foreground-600">Purpose:</span> {record.purpose}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-foreground-400 pl-4">
                    {formatDate(record.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-8 text-center">
              <p className="text-sm font-medium text-foreground-500">
                No consent records found. Please accept the consent notice above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

