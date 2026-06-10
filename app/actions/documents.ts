"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { saveUploadedFile } from "@/lib/files/storage";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function uploadVaultDocument(formData: FormData) {
  const user = await getApplicantUser();
  if (!user) throw new Error("Login required");
  const documentType = String(formData.get("documentType") ?? "Other");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Please choose a file");
  const saved = await saveUploadedFile(file, user.id, documentType);
  const last = await prisma.applicantDocument.findFirst({ where: { applicantId: user.id, documentType }, orderBy: { version: "desc" } });
  const doc = await prisma.applicantDocument.create({ data: { applicantId: user.id, documentType, version: (last?.version ?? 0) + 1, ...saved } });
  await writeAuditLog({ actorId: user.id, action: "VAULT_DOCUMENT_UPLOADED", entityType: "ApplicantDocument", entityId: doc.id, afterJson: { documentType, fileHash: saved.fileHash } });
  revalidatePath("/applicant/documents");
}
