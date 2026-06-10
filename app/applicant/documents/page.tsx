import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { uploadVaultDocument } from "@/app/actions/documents";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, Input, Select, SelectItem, Chip } from "@/components/ui/heroui";
import {
  Upload,
  Camera,
  PenLine,
  Calendar,
  Award,
  GraduationCap,
  Briefcase,
  Accessibility,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";

/* ── Document category config ── */
const DOC_CATEGORIES = [
  {
    type: "Photo",
    label: "Passport Photo",
    icon: Camera,
    description: "Recent passport-size photo (JPEG/PNG, max 100 KB)",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    type: "Signature",
    label: "Scanned Signature",
    icon: PenLine,
    description: "Scanned signature on white paper (JPEG/PNG, max 50 KB)",
    color: "text-success-600",
    bg: "bg-success/10",
  },
  {
    type: "DOB Proof",
    label: "DOB Proof",
    icon: Calendar,
    description: "10th certificate or birth certificate (PDF/JPEG)",
    color: "text-warning-600",
    bg: "bg-warning/10",
  },
  {
    type: "Community Certificate",
    label: "Community Certificate",
    icon: Award,
    description: "SC/ST/OBC/EWS certificate if applicable (PDF)",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    type: "Educational Certificate",
    label: "Educational Certificate",
    icon: GraduationCap,
    description: "Degree / diploma certificate (PDF)",
    color: "text-cyan-600",
    bg: "bg-cyan-100/50",
  },
  {
    type: "Experience Certificate",
    label: "Experience Certificate",
    icon: Briefcase,
    description: "Employment / experience certificates (PDF)",
    color: "text-orange-600",
    bg: "bg-orange-100/50",
  },
  {
    type: "PwBD Certificate",
    label: "PwBD Certificate",
    icon: Accessibility,
    description: "Disability certificate from competent authority (PDF)",
    color: "text-pink-600",
    bg: "bg-pink-100/50",
  },
  {
    type: "Other",
    label: "Other Documents",
    icon: FileText,
    description: "NOC, publications, or other supporting documents (PDF)",
    color: "text-foreground-600",
    bg: "bg-teams-gray/50",
  },
];

export default async function DocumentVaultPage() {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  const docs = await prisma.applicantDocument.findMany({
    where: { applicantId: user.id },
    orderBy: { uploadedAt: "desc" },
  });

  /* Group docs by type */
  const docsByType: Record<string, typeof docs> = {};
  for (const doc of docs) {
    if (!docsByType[doc.documentType]) docsByType[doc.documentType] = [];
    docsByType[doc.documentType].push(doc);
  }

  const docTypeOptions = DOC_CATEGORIES.map((c) => c.type);

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <section className="glass-card p-6 bg-teams-gray/20 border border-teams-border/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10">
            <FolderOpen size={24} className="text-teams-ocean" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teams-dark">
              Document Vault
            </h1>
            <p className="mt-1 text-sm font-medium text-foreground-500">
              Upload and manage your documents. Files are stored securely with SHA-256 integrity hashes. Upload once and reuse across applications.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Form */}
      <Card  className="border border-teams-border/40">
        <CardHeader className="p-6 pb-2">
          <h2 className="text-xl font-bold text-teams-dark">
            Upload New Document
          </h2>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <form
            action={uploadVaultDocument}
            className="flex flex-col md:flex-row items-end gap-4"
          >
            <div className="w-full md:w-1/3">
              <Select
                name="documentType"
                label="Document Type"
                placeholder="Select document type"
                variant="bordered"
                labelPlacement="outside"
                isRequired
                classNames={{ trigger: "bg-white border-teams-border/60" }}
              >
                {docTypeOptions.map((t) => (
                  <SelectItem id={t} key={t} textValue={t}>
                    {t}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="w-full md:w-1/2">
              <Input
                alt="file"
                type="file"
                label="Choose File"
                variant="bordered"
                labelPlacement="outside"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                isRequired
                description="Accepted: PDF, PNG, JPEG, WebP · Max: 2 MB"
                classNames={{ 
                  inputWrapper: "bg-white border-teams-border/60",
                  description: "text-[10px] text-foreground-400 font-semibold"
                }}
              />
            </div>

            <div className="w-full md:w-auto pb-6">
              <Button type="submit" variant="primary" className="font-bold bg-teams-ocean shadow-md w-full md:w-auto" icon={<Upload size={18} />}>
                Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Document Categories Grid */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-teams-dark">
          Document Categories
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {DOC_CATEGORIES.map((cat) => {
            const catDocs = docsByType[cat.type] ?? [];
            const latestDoc = catDocs[0];
            const Icon = cat.icon;

            return (
              <Card key={cat.type}  className="border border-teams-border/40 hover:border-teams-ocean/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg}`}>
                      <Icon className={`h-6 w-6 ${cat.color}`} />
                    </div>

                    {catDocs.length > 0 ? (
                      <Chip variant="primary" size="sm" variant="ghost" startContent={<CheckCircle2 size={12} />} className="font-bold border border-success/20">
                        Uploaded
                      </Chip>
                    ) : (
                      <Chip color="default" size="sm" variant="ghost" startContent={<Clock size={12} />} className="font-bold border border-foreground-200 text-foreground-500">
                        Pending
                      </Chip>
                    )}
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-teams-dark">
                    {cat.label}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-foreground-500">
                    {cat.description}
                  </p>

                  {latestDoc && (
                    <div className="mt-4 rounded-xl bg-teams-gray/10 p-3 border border-teams-border/30">
                      <p className="truncate text-xs font-bold text-teams-dark">
                        {latestDoc.originalName}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-foreground-400">
                        v{latestDoc.version} &middot;{" "}
                        {(latestDoc.sizeBytes / 1024).toFixed(1)} KB &middot;{" "}
                        {formatDate(latestDoc.uploadedAt)}
                      </p>
                      <p className="mt-1 break-all font-mono text-[9px] text-foreground-400/80">
                        SHA: {latestDoc.fileHash.slice(0, 16)}…
                      </p>

                      {/* Preview link */}
                      <a
                        href={`/api/documents/${latestDoc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-1 w-fit rounded bg-white px-2 py-1 text-[10px] font-bold text-teams-ocean border border-teams-border/40 hover:bg-teams-ocean hover:text-white transition-colors"
                      >
                        <Eye size={12} />
                        Preview
                      </a>
                    </div>
                  )}

                  {/* Version history */}
                  {catDocs.length > 1 && (
                    <details className="mt-3 group">
                      <summary className="cursor-pointer text-[10px] font-bold text-teams-ocean hover:underline list-none">
                        {catDocs.length - 1} older version(s)
                      </summary>
                      <div className="mt-2 space-y-2">
                        {catDocs.slice(1).map((d) => (
                          <div
                            key={d.id}
                            className="rounded-lg bg-teams-gray/5 p-2 text-[10px] font-medium text-foreground-500 border border-teams-border/20"
                          >
                            <span className="font-bold">v{d.version}</span> &middot; {d.originalName} &middot;{" "}
                            {formatDate(d.uploadedAt)}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* All Uploaded Documents List */}
      {docs.length > 0 && (
        <Card  className="border border-teams-border/40">
          <CardHeader className="p-6 pb-2">
            <h2 className="text-xl font-bold text-teams-dark">
              All Uploaded Documents
            </h2>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="space-y-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-teams-border/30 bg-teams-gray/10 p-4 transition hover:bg-teams-gray/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-teams-border/20">
                      <FileText className="h-5 w-5 text-teams-ocean" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-teams-dark">
                        {doc.documentType}
                      </p>
                      <p className="text-xs font-medium text-foreground-500 mt-0.5">
                        {doc.originalName} &middot; v{doc.version} &middot;{" "}
                        {(doc.sizeBytes / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden text-xs font-semibold text-foreground-400 sm:block">
                      {formatDate(doc.uploadedAt)}
                    </span>
                    <Button
                      
                      href={`/api/documents/${doc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="ghost"
                      className="font-bold bg-teams-ocean/10 text-teams-ocean"
                      icon={<Eye size={14} />}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Added this to fix the missing FolderOpen import at the top
import { FolderOpen } from "lucide-react";

