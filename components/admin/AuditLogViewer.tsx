"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════ */
/*  Types                                              */
/* ═══════════════════════════════════════════════════ */

type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorName: string;
  actorRole: string;
  ipAddress: string | null;
  userAgent: string | null;
  beforeJson: Record<string, unknown> | null;
  afterJson: Record<string, unknown> | null;
  previousHash: string | null;
  currentHash: string;
  hashValid: boolean;
  createdAt: string;
};

type Filters = {
  action: string;
  entity: string;
  actor: string;
  from: string;
  to: string;
};

/* ═══════════════════════════════════════════════════ */
/*  Component                                          */
/* ═══════════════════════════════════════════════════ */

export function AuditLogViewer({
  logs,
  currentPage,
  totalPages,
  totalCount,
  entityTypes,
  actionTypes,
  filters,
}: {
  logs: AuditEntry[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  entityTypes: string[];
  actionTypes: string[];
  filters: Filters;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState(filters.action);
  const [entityFilter, setEntityFilter] = useState(filters.entity);
  const [actorFilter, setActorFilter] = useState(filters.actor);
  const [dateFrom, setDateFrom] = useState(filters.from);
  const [dateTo, setDateTo] = useState(filters.to);

  const navigate = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged = {
        action: actionFilter,
        entity: entityFilter,
        actor: actorFilter,
        from: dateFrom,
        to: dateTo,
        page: "1",
        ...overrides,
      };
      for (const [k, v] of Object.entries(merged)) {
        if (v) params.set(k, v);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, actionFilter, entityFilter, actorFilter, dateFrom, dateTo]
  );

  const applyFilters = () => navigate({});
  const clearFilters = () => {
    setActionFilter("");
    setEntityFilter("");
    setActorFilter("");
    setDateFrom("");
    setDateTo("");
    router.push(pathname);
  };

  const exportCsv = useCallback(() => {
    const csv = [
      "Timestamp,Actor,Role,Action,Entity Type,Entity ID,Hash Valid",
      ...logs.map(
        (l) =>
          `${l.createdAt},${l.actorName},${l.actorRole},${l.action},${l.entityType},${l.entityId},${l.hashValid}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-page${currentPage}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs, currentPage]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filters
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="input !py-1.5 !text-xs"
            >
              <option value="">All Actions</option>
              {actionTypes.map((a) => (
                <option key={a} value={a}>
                  {a.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Entity Type</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="input !py-1.5 !text-xs"
            >
              <option value="">All Entities</option>
              {entityTypes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Actor ID</label>
            <input
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="input !py-1.5 !text-xs"
              placeholder="Actor ID..."
            />
          </div>
          <div>
            <label className="label">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input !py-1.5 !text-xs"
            />
          </div>
          <div>
            <label className="label">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input !py-1.5 !text-xs"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={applyFilters}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
          <div className="flex-1" />
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-8" />
                <th>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Timestamp
                  </div>
                </th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Integrity
                  </div>
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <>
                  <tr
                    key={log.id}
                    className={cn(
                      "cursor-pointer",
                      expandedId === log.id && "bg-blue-50/50"
                    )}
                    onClick={() =>
                      setExpandedId(expandedId === log.id ? null : log.id)
                    }
                  >
                    <td>
                      {expandedId === log.id ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </td>
                    <td className="whitespace-nowrap text-slate-600">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>
                      <div>
                        <span className="font-semibold text-slate-800">
                          {log.actorName}
                        </span>
                        <span className="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                          {log.actorRole}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-800">
                        {log.action.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-700">
                      {log.entityType}
                    </td>
                    <td className="font-mono text-[11px] text-slate-500 max-w-[120px] truncate">
                      {log.entityId}
                    </td>
                    <td className="text-center">
                      {log.hashValid ? (
                        <ShieldCheck className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <ShieldAlert className="mx-auto h-4 w-4 text-red-600" />
                      )}
                    </td>
                    <td />
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`${log.id}-detail`}>
                      <td colSpan={8} className="bg-slate-50/70 p-0">
                        <div className="animate-fade-in p-5 space-y-4">
                          {/* Hashes */}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg bg-white p-3">
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Current Hash
                              </p>
                              <p className="font-mono text-[11px] text-slate-600 break-all">
                                {log.currentHash}
                              </p>
                            </div>
                            <div className="rounded-lg bg-white p-3">
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Previous Hash
                              </p>
                              <p className="font-mono text-[11px] text-slate-600 break-all">
                                {log.previousHash ?? "— (genesis)"}
                              </p>
                            </div>
                          </div>

                          {/* IP / User Agent */}
                          {(log.ipAddress || log.userAgent) && (
                            <div className="rounded-lg bg-white p-3 text-xs text-slate-500">
                              {log.ipAddress && (
                                <p>
                                  <span className="font-semibold text-slate-600">
                                    IP:
                                  </span>{" "}
                                  {log.ipAddress}
                                </p>
                              )}
                              {log.userAgent && (
                                <p className="mt-1 truncate">
                                  <span className="font-semibold text-slate-600">
                                    UA:
                                  </span>{" "}
                                  {log.userAgent}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Before / After JSON */}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg bg-white p-3">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-red-400">
                                Before
                              </p>
                              <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-[11px] text-slate-600">
                                {log.beforeJson
                                  ? JSON.stringify(log.beforeJson, null, 2)
                                  : "—"}
                              </pre>
                            </div>
                            <div className="rounded-lg bg-white p-3">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-green-500">
                                After
                              </p>
                              <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-[11px] text-slate-600">
                                {log.afterJson
                                  ? JSON.stringify(log.afterJson, null, 2)
                                  : "—"}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    No audit logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-white/40 bg-white/40 px-4 py-3">
          <p className="text-xs font-semibold text-slate-500">
            Page {currentPage} of {totalPages} · {totalCount} total entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate({ page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => navigate({ page: String(currentPage + 1) })}
              disabled={currentPage >= totalPages}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
