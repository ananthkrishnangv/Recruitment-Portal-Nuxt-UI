"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Search,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Shield,
  Send,
} from "lucide-react";
import { ColourTag } from "./ColourTag";
import { cn } from "@/lib/utils";
import { updateApplicationStatus } from "@/app/actions/scrutiny";

/* ═══════════════════════════════════════════════════ */
/*  Types                                              */
/* ═══════════════════════════════════════════════════ */

type Document = {
  id: string;
  documentType: string;
  originalName: string;
  mimeType: string;
  storageKey: string;
  ocrText: string | null;
  ocrConfidence: number | null;
  verificationStatus: string;
  verificationRemarks: string | null;
};

type ScrutinyAction = {
  id: string;
  fromStatus: string;
  toStatus: string;
  remarks: string | null;
  createdAt: string;
};

type Application = {
  id: string;
  applicationNo: string;
  applicantName: string;
  category: string;
  dob: string;
  status: string;
  postTitle: string;
  paymentStatus: string | null;
  formData: Record<string, unknown>;
  eligibilityResult: Record<string, unknown> | null;
  documents: Document[];
  scrutinyActions: ScrutinyAction[];
};

/* ═══════════════════════════════════════════════════ */
/*  Component                                          */
/* ═══════════════════════════════════════════════════ */

export function ScrutinyPanel({
  applications,
}: {
  applications: Application[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    applications[0]?.id ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredApps = useMemo(() => {
    let apps = applications;
    if (statusFilter) {
      apps = apps.filter((a) => a.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.applicationNo.toLowerCase().includes(q) ||
          a.applicantName.toLowerCase().includes(q)
      );
    }
    return apps;
  }, [applications, searchQuery, statusFilter]);

  const selected = applications.find((a) => a.id === selectedId) ?? null;
  const previewDoc = selected?.documents.find((d) => d.id === previewDocId) ?? null;

  const handleAction = (toStatus: string) => {
    if (!selected) return;
    const formData = new FormData();
    formData.set("applicationNo", selected.applicationNo);
    formData.set("toStatus", toStatus);
    formData.set("remarks", remarks);
    startTransition(async () => {
      await updateApplicationStatus(formData);
      setRemarks("");
    });
  };

  const isImageType = (mime: string) =>
    mime.startsWith("image/");
  const isPdfType = (mime: string) =>
    mime === "application/pdf";

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 overflow-hidden rounded-2xl border border-white/40 bg-white/40 shadow-lg backdrop-blur-xl">
      {/* ═══════════════════════════════════════════ */}
      {/*  LEFT PANEL — Application Queue              */}
      {/* ═══════════════════════════════════════════ */}
      <div className="w-72 shrink-0 border-r border-slate-200/60 bg-white/60 flex flex-col">
        {/* Search & Filter */}
        <div className="p-3 space-y-2 border-b border-slate-100">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none bg-transparent text-xs"
              placeholder="Search applications..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input !py-1.5 !text-xs"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_SCRUTINY">Under Scrutiny</option>
            <option value="DEFICIENCY_RAISED">Deficiency Raised</option>
            <option value="RECOMMENDED">Recommended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* App List */}
        <div className="flex-1 overflow-y-auto">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setSelectedId(app.id);
                setPreviewDocId(null);
              }}
              className={cn(
                "flex w-full items-center gap-3 border-b border-slate-100 px-3 py-3 text-left transition-colors",
                selectedId === app.id
                  ? "bg-blue-50 border-l-2 border-l-blue-600"
                  : "hover:bg-slate-50"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-blue-900">
                  {app.applicationNo}
                </p>
                <p className="truncate text-[11px] text-slate-600">
                  {app.applicantName}
                </p>
                <div className="mt-1">
                  <ColourTag value={app.status} className="!text-[10px] !px-2 !py-0.5" />
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
            </button>
          ))}
          {filteredApps.length === 0 && (
            <p className="p-4 text-center text-xs text-slate-400">
              No applications found
            </p>
          )}
        </div>
        <div className="border-t border-slate-100 px-3 py-2">
          <p className="text-[10px] font-semibold text-slate-400">
            {filteredApps.length} application(s)
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  CENTER PANEL — Details & Actions            */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto bg-white/30 p-6">
        {selected ? (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="heading-font text-lg font-bold text-blue-950">
                  {selected.applicantName}
                </h2>
                <p className="text-sm text-slate-500">
                  {selected.applicationNo} · {selected.postTitle}
                </p>
              </div>
              <ColourTag value={selected.status} />
            </div>

            {/* Basic Info */}
            <div className="rounded-xl bg-slate-50/80 p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Applicant Details
              </h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Category</dt>
                  <dd><ColourTag value={selected.category} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Date of Birth</dt>
                  <dd className="font-semibold text-slate-700">
                    {new Date(selected.dob).toLocaleDateString("en-IN")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Payment Status</dt>
                  <dd>
                    <ColourTag value={selected.paymentStatus ?? "Pending"} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Post</dt>
                  <dd className="font-semibold text-slate-700">
                    {selected.postTitle}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Eligibility Result */}
            {selected.eligibilityResult && (
              <div className="rounded-xl border p-4 border-emerald-200 bg-emerald-50/50">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Shield className="h-3.5 w-3.5" />
                  Eligibility Result
                </h3>
                <pre className="text-xs text-slate-700 whitespace-pre-wrap overflow-auto max-h-32">
                  {JSON.stringify(selected.eligibilityResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Form Data */}
            {selected.formData && Object.keys(selected.formData).length > 0 && (
              <div className="rounded-xl bg-slate-50/80 p-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Form Data
                </h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {Object.entries(selected.formData).map(([key, val]) => (
                    <div key={key}>
                      <dt className="text-xs text-slate-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </dt>
                      <dd className="font-semibold text-slate-700">
                        {String(val)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Scrutiny History */}
            {selected.scrutinyActions.length > 0 && (
              <div className="rounded-xl bg-slate-50/80 p-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Scrutiny History
                </h3>
                <div className="space-y-2">
                  {selected.scrutinyActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start gap-3 rounded-lg bg-white p-3 text-xs"
                    >
                      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-700">
                          <ColourTag value={action.fromStatus} className="!text-[10px] !px-1.5 !py-0" />
                          <span className="mx-1.5 text-slate-400">→</span>
                          <ColourTag value={action.toStatus} className="!text-[10px] !px-1.5 !py-0" />
                        </p>
                        {action.remarks && (
                          <p className="mt-1 text-slate-500">
                            {action.remarks}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] text-slate-400">
                          {new Date(action.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Form */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-800">
                Scrutiny Action
              </h3>
              <TextArea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="input mb-3"
                placeholder="Enter remarks for this action..."
                rows={3}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAction("RECOMMENDED")}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Recommend
                </button>
                <button
                  onClick={() => handleAction("DEFICIENCY_RAISED")}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Raise Deficiency
                </button>
                <button
                  onClick={() => handleAction("REJECTED")}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
                <button
                  onClick={() => handleAction("UNDER_SCRUTINY")}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Forward to Reviewer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-400">
                Select an application to review
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  RIGHT PANEL — Document Preview              */}
      {/* ═══════════════════════════════════════════ */}
      <div className="w-80 shrink-0 border-l border-slate-200/60 bg-white/60 flex flex-col">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Documents
          </h3>
        </div>

        {selected ? (
          <>
            {/* Document List */}
            <div className="flex-shrink-0 max-h-52 overflow-y-auto border-b border-slate-100">
              {selected.documents.length > 0 ? (
                selected.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setPreviewDocId(doc.id)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-slate-50 px-4 py-2.5 text-left transition-colors",
                      previewDocId === doc.id
                        ? "bg-blue-50"
                        : "hover:bg-slate-50"
                    )}
                  >
                    {isImageType(doc.mimeType) ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {doc.documentType.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="truncate text-[10px] text-slate-400">
                        {doc.originalName}
                      </p>
                    </div>
                    <ColourTag
                      value={doc.verificationStatus}
                      className="!text-[9px] !px-1.5 !py-0"
                    />
                  </button>
                ))
              ) : (
                <p className="p-4 text-center text-xs text-slate-400">
                  No documents uploaded
                </p>
              )}
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {previewDoc ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Preview */}
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    {isImageType(previewDoc.mimeType) ? (
                      <div className="flex items-center justify-center bg-slate-100 p-4">
                        <img
                          src={`/api/files/${previewDoc.storageKey}`}
                          alt={previewDoc.originalName}
                          className="max-h-64 w-auto rounded"
                        />
                      </div>
                    ) : isPdfType(previewDoc.mimeType) ? (
                      <iframe
                        src={`/api/files/${previewDoc.storageKey}`}
                        title={previewDoc.originalName}
                        className="h-64 w-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                          <Eye className="mx-auto h-8 w-8 text-slate-300" />
                          <p className="mt-2 text-xs text-slate-400">
                            Preview not available
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* OCR Text */}
                  {previewDoc.ocrText && (
                    <div className="rounded-xl bg-slate-50 p-3">
                      <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        OCR Text
                        {previewDoc.ocrConfidence != null && (
                          <span className="ml-1 text-slate-400">
                            ({(previewDoc.ocrConfidence * 100).toFixed(1)}%
                            confidence)
                          </span>
                        )}
                      </h4>
                      <p className="max-h-24 overflow-y-auto text-xs text-slate-600 whitespace-pre-wrap">
                        {previewDoc.ocrText}
                      </p>
                    </div>
                  )}

                  {/* Verification Remarks */}
                  {previewDoc.verificationRemarks && (
                    <div className="rounded-xl bg-amber-50 p-3">
                      <h4 className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Verification Remarks
                      </h4>
                      <p className="text-xs text-amber-700">
                        {previewDoc.verificationRemarks}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors">
                      <CheckCircle2 className="h-3 w-3" />
                      Mark Verified
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors">
                      <XCircle className="h-3 w-3" />
                      Mark Deficient
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Eye className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-xs text-slate-400">
                      Select a document to preview
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-xs text-slate-400">
              Select an application first
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
