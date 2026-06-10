"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function updateApplicationStatus(formData: FormData) {
  await requireAdmin();
  const applicationNo = String(formData.get("applicationNo"));
  const toStatus = String(formData.get("toStatus")) as any;
  const remarks = String(formData.get("remarks") ?? "");
  const before = await prisma.application.findUniqueOrThrow({ where: { applicationNo } });
  const after = await prisma.application.update({ where: { applicationNo }, data: { status: toStatus } });
  await prisma.scrutinyAction.create({ data: { applicationId: after.id, actorId: "demo-admin", fromStatus: before.status, toStatus, remarks } });
  await writeAuditLog({ action: "SCRUTINY_STATUS_UPDATED", entityType: "Application", entityId: after.id, beforeJson: before, afterJson: { status: toStatus, remarks } });
  revalidatePath("/admin/scrutiny");
  revalidatePath("/admin/applications");
}
