"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function acceptDpdpConsent(formData: FormData) {
  const user = await getApplicantUser();
  if (!user) throw new Error("Login required");
  const notice = await prisma.consentNotice.findFirstOrThrow({ where: { active: true }, orderBy: { createdAt: "desc" } });
  const accepted = formData.get("accepted") === "on";
  const purpose = String(formData.get("purpose") ?? "Recruitment application processing");
  const record = await prisma.consentRecord.create({ data: { userId: user.id, noticeId: notice.id, purpose, accepted } });
  await prisma.user.update({ where: { id: user.id }, data: { consentVersion: notice.version, consentAt: new Date() } });
  await writeAuditLog({ actorId: user.id, action: "DPDP_CONSENT_RECORDED", entityType: "ConsentRecord", entityId: record.id, afterJson: { noticeVersion: notice.version, accepted, purpose } });
  revalidatePath("/applicant/consent");
}
