"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import type { Category } from "@/lib/compliance/dopt-rules";
import { validateRecruitmentApplication } from "@/lib/compliance/recruitment-validation";
import { writeAuditLog } from "@/lib/audit/hash-chain";
import crypto from "node:crypto";

export async function createOrUpdateDraft(formData: FormData) {
  const user = await getApplicantUser();
  if (!user) throw new Error("Login required");
  const postCode = String(formData.get("postCode") ?? "TO-2026");
  const category = String(formData.get("category") ?? "UR") as Category;
  const dob = new Date(String(formData.get("dob") ?? "1993-05-10"));
  const qualification = String(formData.get("qualification") ?? "");
  const experienceYears = Number(formData.get("experienceYears") ?? 0);
  const post = await prisma.recruitmentPost.findUniqueOrThrow({ where: { postCode } });
  const validation = await validateRecruitmentApplication({ postCode, category, dob, qualification, experienceYears });
  const eligibility = validation.ageResult ?? { eligible: false, ruleVersion: "DEMO-DOPT-CSIR-v2" };
  const existing = await prisma.application.findFirst({ where: { applicantId: user.id, postId: post.id, status: "DRAFT" } });
  const appNo = existing?.applicationNo ?? `APP-${new Date().toISOString().slice(0,10).replaceAll("-", "")}-${Math.floor(Math.random()*9000+1000)}`;
  const app = await prisma.application.upsert({
    where: { applicationNo: appNo },
    update: { category, dob, formData: { qualification, experienceYears }, eligibilityResult: eligibility, validationResult: validation },
    create: { applicationNo: appNo, applicantId: user.id, postId: post.id, category, dob, formData: { qualification, experienceYears }, eligibilityResult: eligibility, validationResult: validation }
  });
  await writeAuditLog({ actorId: user.id, action: "APPLICATION_DRAFT_SAVED", entityType: "Application", entityId: app.id, afterJson: app });
  revalidatePath("/applicant/dashboard");
  return app.applicationNo;
}

export async function submitApplication(applicationNo: string) {
  const user = await getApplicantUser();
  if (!user) throw new Error("Login required");
  const before = await prisma.application.findUniqueOrThrow({ where: { applicationNo } });
  if (before.applicantId !== user.id) throw new Error("Not allowed");
  const finalHash = crypto.createHash("sha256").update(JSON.stringify(before)).digest("hex");
  const after = await prisma.application.update({ where: { applicationNo }, data: { status: "SUBMITTED", submittedAt: new Date(), lockedAt: new Date(), finalHash } });
  await writeAuditLog({ actorId: user.id, action: "APPLICATION_SUBMITTED_LOCKED", entityType: "Application", entityId: after.id, beforeJson: before, afterJson: after });
  revalidatePath("/applicant/dashboard");
}
