import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
import { ScrollText } from "lucide-react";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    action?: string;
    entity?: string;
    actor?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 20;

  // Build filters
  const where: Record<string, unknown> = {};
  if (params.action) where.action = { contains: params.action };
  if (params.entity) where.entityType = params.entity;
  if (params.actor) where.actorId = params.actor;
  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from && { gte: new Date(params.from) }),
      ...(params.to && { lte: new Date(params.to + "T23:59:59Z") }),
    };
  }

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        actor: { select: { name: true, role: true } },
      },
    }),
    prisma.auditLog.count({ where: where as any }),
  ]);

  // Check hash chain integrity for displayed logs
  const logsWithIntegrity = logs.map((log, idx) => {
    const prevLog = idx < logs.length - 1 ? logs[idx + 1] : null;
    const hashValid =
      !log.previousHash ||
      (prevLog && log.previousHash === prevLog.currentHash) ||
      idx === logs.length - 1; // last on page, can't verify
    return {
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      actorName: log.actor?.name ?? "System",
      actorRole: log.actor?.role ?? "SYSTEM",
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      beforeJson: log.beforeJson as Record<string, unknown> | null,
      afterJson: log.afterJson as Record<string, unknown> | null,
      previousHash: log.previousHash,
      currentHash: log.currentHash,
      hashValid: Boolean(hashValid),
      createdAt: log.createdAt.toISOString(),
    };
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // Get unique entity types and actions for filters
  const entityTypes = await prisma.auditLog.groupBy({ by: ["entityType"] });
  const actionTypes = await prisma.auditLog.groupBy({ by: ["action"] });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 bg-teams-gray/20 p-6 rounded-xl border border-teams-border/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10">
          <ScrollText className="h-6 w-6 text-teams-ocean" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-teams-dark">
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-foreground-500 font-medium">
            Tamper-evident log of all portal activities ({totalCount} total entries)
          </p>
        </div>
      </div>

      <AuditLogViewer
        logs={logsWithIntegrity}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        entityTypes={entityTypes.map((e) => e.entityType)}
        actionTypes={actionTypes.map((a) => a.action)}
        filters={{
          action: params.action ?? "",
          entity: params.entity ?? "",
          actor: params.actor ?? "",
          from: params.from ?? "",
          to: params.to ?? "",
        }}
      />
    </div>
  );
}
