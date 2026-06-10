"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function saveSetting(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "");
  const isSecret = formData.get("isSecret") === "on";
  if (!key) throw new Error("Setting key required");
  const before = await prisma.siteSetting.findUnique({ where: { key } });
  const after = await prisma.siteSetting.upsert({ where: { key }, update: { value, isSecret }, create: { key, value, isSecret } });
  await writeAuditLog({ action: "SETTING_UPDATED", entityType: "SiteSetting", entityId: after.id, beforeJson: before, afterJson: { key, value: isSecret ? "***MASKED***" : value, isSecret } });
  revalidatePath("/admin/settings");
}
