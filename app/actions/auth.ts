"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { encryptField } from "@/lib/security/encryption";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function applicantLogin(formData: FormData) {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const name = String(formData.get("name") ?? "Applicant").trim() || "Applicant";
  const otp = String(formData.get("otp") ?? "").trim();
  const demoOtp = process.env.DEMO_OTP || "123456";
  if (!identifier || otp !== demoOtp) return { ok: false, message: "Invalid OTP" };

  const isAadhaarLike = /^\d{12}$/.test(identifier.replaceAll("-", ""));
  const plainAadhaar = isAadhaarLike ? identifier.replaceAll("-", "") : null;
  const mobile = isAadhaarLike ? undefined : identifier;
  const where = mobile ? { mobile } : { aadhaarLast4: plainAadhaar!.slice(-4) };

  const user = await prisma.user.upsert({
    where: mobile ? { mobile } : { mobile: `AADHAAR-LOCAL-${plainAadhaar!.slice(-4)}` },
    update: { name },
    create: {
      mobile: mobile ?? `AADHAAR-LOCAL-${plainAadhaar!.slice(-4)}`,
      name,
      aadhaarLocalEncrypted: plainAadhaar ? encryptField(plainAadhaar) : null,
      aadhaarLast4: plainAadhaar ? plainAadhaar.slice(-4) : null,
      consentVersion: "DPDP-v1",
      consentAt: new Date()
    }
  });

  await writeAuditLog({ actorId: user.id, action: "APPLICANT_LOGIN", entityType: "User", entityId: user.id, afterJson: { identifierType: isAadhaarLike ? "LOCAL_AADHAAR" : "PHONE" } });
  const store = await cookies();
  store.set("applicant_identifier", user.mobile ?? identifier, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  redirect("/applicant/dashboard");
}

export async function adminLogin(formData: FormData) {
  const pin = String(formData.get("pin") ?? "");
  if (pin !== (process.env.ADMIN_BOOTSTRAP_PIN || "123456")) return { ok: false };
  const store = await cookies();
  store.set("admin_session", "demo-admin", { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  redirect("/admin/applications");
}

export async function logout() {
  const store = await cookies();
  store.delete("applicant_identifier");
  store.delete("admin_session");
  redirect("/");
}
