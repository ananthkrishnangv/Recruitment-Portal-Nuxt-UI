import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { safeJson } from "@/lib/utils";

export async function writeAuditLog(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson?: unknown;
  afterJson?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const previous = await prisma.auditLog.findFirst({ orderBy: { createdAt: "desc" } });
  const payload = JSON.stringify({
    actorId: input.actorId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    beforeJson: input.beforeJson ?? null,
    afterJson: input.afterJson ?? null,
    previousHash: previous?.currentHash ?? null
  });
  const currentHash = crypto.createHash("sha256").update(payload).digest("hex");
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      beforeJson: input.beforeJson === undefined ? undefined : safeJson(input.beforeJson),
      afterJson: input.afterJson === undefined ? undefined : safeJson(input.afterJson),
      previousHash: previous?.currentHash ?? null,
      currentHash,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null
    }
  });
}
