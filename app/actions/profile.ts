"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function updateProfile(formData: FormData) {
  const user = await getApplicantUser();
  if (!user) throw new Error("Login required");

  const name = String(formData.get("name") ?? user.name).trim();
  const email = String(formData.get("email") ?? "").trim() || null;

  const before = { name: user.name, email: user.email };

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, email },
  });

  await writeAuditLog({
    actorId: user.id,
    action: "PROFILE_UPDATED",
    entityType: "User",
    entityId: user.id,
    beforeJson: before,
    afterJson: { name: updated.name, email: updated.email },
  });

  revalidatePath("/applicant/profile");
  revalidatePath("/applicant/dashboard");
}
