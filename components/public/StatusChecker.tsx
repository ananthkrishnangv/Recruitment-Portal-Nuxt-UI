"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface StatusResult {
  applicationNo: string;
  status: string;
  postTitle: string;
  submittedAt: string | null;
}

export function StatusChecker() {
  const [appNo, setAppNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    const trimmed = appNo.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/status-check?appNo=${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error || "Application not found. Please check the number and try again."
        );
      }
      const data: StatusResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("submitted") || s.includes("approved")) return "text-emerald-700 bg-emerald-50";
    if (s.includes("draft") || s.includes("pending")) return "text-amber-700 bg-amber-50";
    if (s.includes("reject") || s.includes("deficien")) return "text-red-700 bg-red-50";
    return "text-blue-700 bg-blue-50";
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h3 className="heading-font text-xl font-bold text-blue-950">
        Check Application Status
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Enter your application number to check the current status of your application.
      </p>

      {/* Search Input */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={appNo}
            onChange={(e) => setAppNo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="e.g. SERC-2026-001234"
            className="input pl-9"
            aria-label="Application number"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading || !appNo.trim()}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Checking…
            </>
          ) : (
            <>
              <Search size={16} />
              Check Status
            </>
          )}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="animate-fade-in-up mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 size={20} />
            <span className="text-sm font-semibold">Application Found</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Application No.
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">
                {result.applicationNo}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </p>
              <span
                className={`mt-0.5 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusColor(result.status)}`}
              >
                {result.status.replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Post / Position
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                {result.postTitle}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Submitted On
              </p>
              <p className="mt-0.5 text-sm text-slate-700">
                {result.submittedAt
                  ? new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                    }).format(new Date(result.submittedAt))
                  : "Not yet submitted"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="animate-fade-in-up mt-5 rounded-2xl border border-red-200 bg-red-50/50 p-5">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm font-semibold">Not Found</span>
          </div>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
