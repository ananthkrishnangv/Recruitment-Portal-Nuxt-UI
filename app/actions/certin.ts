"use server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function createCertInIncident(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const severity = String(formData.get("severity") ?? "MEDIUM") as any;
  const affectedSystems = String(formData.get("affectedSystems") ?? "Portal").split(",").map(s => s.trim()).filter(Boolean);
  const evidenceHash = crypto.createHash("sha256").update(`${title}|${description}|${Date.now()}`).digest("hex");
  const incident = await prisma.certInIncident.create({ data: { title, description, severity, affectedSystems, evidenceHash } });
  await writeAuditLog({ action: "CERTIN_INCIDENT_CREATED", entityType: "CertInIncident", entityId: incident.id, afterJson: incident });
  revalidatePath("/admin/cert-in");
}

export async function markIncidentReported(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const reportReference = String(formData.get("reportReference") ?? "Manual reference pending");
  const before = await prisma.certInIncident.findUniqueOrThrow({ where: { id } });
  const after = await prisma.certInIncident.update({ where: { id }, data: { status: "REPORTED_TO_CERT_IN", reportedAt: new Date(), reportReference } });
  await writeAuditLog({ action: "CERTIN_INCIDENT_REPORTED", entityType: "CertInIncident", entityId: id, beforeJson: before, afterJson: after });
  revalidatePath("/admin/cert-in");
}

export async function updateSecurityControl(formData: FormData) {
  await requireAdmin();
  const controlCode = String(formData.get("controlCode"));
  const status = String(formData.get("status") ?? "PENDING");
  const remarks = String(formData.get("remarks") ?? "");
  const before = await prisma.securityControlCheck.findUnique({ where: { controlCode } });
  const after = await prisma.securityControlCheck.upsert({ where: { controlCode }, update: { status, remarks }, create: { controlCode, controlName: controlCode, framework: "CERT-In", status, remarks } });
  await writeAuditLog({ action: "SECURITY_CONTROL_UPDATED", entityType: "SecurityControlCheck", entityId: after.id, beforeJson: before, afterJson: after });
  revalidatePath("/admin/cert-in");
}
