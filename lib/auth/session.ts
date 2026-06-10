import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function getApplicantIdentifier() {
  const store = await cookies();
  return store.get("applicant_identifier")?.value ?? null;
}

export async function getApplicantUser() {
  const identifier = await getApplicantIdentifier();
  if (!identifier) return null;
  return prisma.user.findFirst({ where: { OR: [{ mobile: identifier }, { aadhaarLast4: identifier.slice(-4) }] } });
}

export async function getAdminSession() {
  const store = await cookies();
  return store.get("admin_session")?.value === "demo-admin";
}

export async function requireAdmin() {
  const ok = await getAdminSession();
  if (!ok) throw new Error("Unauthorized admin access");
}
