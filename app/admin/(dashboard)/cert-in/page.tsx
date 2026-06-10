import { prisma } from "@/lib/db/prisma";
import {
  createCertInIncident,
  markIncidentReported,
  updateSecurityControl,
} from "@/app/actions/certin";
import { ColourTag } from "@/components/admin/ColourTag";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "CERT-In Security Console",
};

export default async function CertInPage() {
  const incidents = await prisma.certInIncident.findMany({
    orderBy: { detectedAt: "desc" },
  });
  const controls = await prisma.securityControlCheck.findMany({
    orderBy: { controlCode: "asc" },
  });
  const settings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: "security.certin" } },
    orderBy: { key: "asc" },
  });

  const openIncidents = incidents.filter((i) => i.status === "DETECTED");
  const reportedIncidents = incidents.filter(
    (i) => i.status === "REPORTED_TO_CERT_IN"
  );
  const resolvedIncidents = incidents.filter(
    (i) => i.status === "RESOLVED"
  );

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <section className="glass-card p-6 bg-teams-gray/20 border border-teams-border/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10">
            <ShieldAlert size={24} className="text-danger" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teams-dark">
              CERT-In Security & Incident Console
            </h1>
            <p className="mt-1 text-sm text-foreground-500 font-medium">
              Incident reporting, security controls checklist, audit evidence tracking, and compliance configuration.
            </p>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">
                {openIncidents.length}
              </p>
              <p className="text-xs text-slate-500">Open Incidents</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">
                {reportedIncidents.length}
              </p>
              <p className="text-xs text-slate-500">Reported</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">
                {resolvedIncidents.length}
              </p>
              <p className="text-xs text-slate-500">Resolved</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <Shield size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">
                {controls.length}
              </p>
              <p className="text-xs text-slate-500">Security Controls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Settings */}
      {settings.length > 0 && (
        <section className="glass-card p-6">
          <h2 className="heading-font text-xl font-bold text-blue-950 mb-4">
            Compliance Configuration
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {settings.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl bg-white/75 p-3 border border-slate-100"
              >
                <span className="text-sm font-semibold text-slate-700">
                  {s.key.replace("security.certin.", "")}
                </span>
                <span className="font-bold text-blue-950">
                  {JSON.stringify(s.value)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create Incident & Security Controls */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* Create Incident Form */}
        <form action={createCertInIncident} className="glass-card p-6">
          <h2 className="heading-font text-xl font-bold text-blue-950 mb-4">
            <AlertTriangle size={18} className="inline mr-2 text-amber-600" />
            Report Security Incident
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label label-required">Incident Title</label>
              <input
                alt="title"
                required
                className="input"
                placeholder="Brief description of the incident"
              />
            </div>
            <div>
              <label className="label label-required">Severity</label>
              <select name="severity" className="input">
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
            <div>
              <label className="label">Affected Systems</label>
              <input
                alt="affectedSystems"
                className="input"
                placeholder="Portal, Database, API (comma-separated)"
              />
            </div>
            <div>
              <label className="label label-required">Description</label>
              <TextArea
                name="description"
                required
                className="input"
                rows={4}
                placeholder="Detailed description of the incident, impact assessment, and immediate actions taken..."
              />
            </div>
            <button className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-red-700">
              Create Incident Report
            </button>
          </div>
        </form>

        {/* Security Controls */}
        <section className="glass-card p-6">
          <h2 className="heading-font text-xl font-bold text-blue-950 mb-4">
            <Shield size={18} className="inline mr-2 text-blue-600" />
            Security Control Checklist
          </h2>
          <div className="max-h-[500px] space-y-3 overflow-auto pr-2">
            {controls.map((c) => (
              <form
                key={c.id}
                action={updateSecurityControl}
                className="rounded-2xl bg-white/75 p-4 border border-slate-100"
              >
                <input
                  type="hidden"
                  alt="controlCode"
                  value={c.controlCode}
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-blue-950">{c.controlCode}</p>
                    <p className="text-xs text-slate-600">{c.controlName}</p>
                    <span className="mt-1 inline-block text-[10px] font-semibold text-slate-400 uppercase">
                      {c.framework}
                    </span>
                  </div>
                  <select
                    name="status"
                    defaultValue={c.status}
                    className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IMPLEMENTED_DEMO">IMPLEMENTED (DEMO)</option>
                    <option value="IMPLEMENTED">IMPLEMENTED</option>
                    <option value="NEEDS_REMEDIATION">NEEDS REMEDIATION</option>
                  </select>
                </div>
                <input
                  alt="remarks"
                  defaultValue={c.remarks ?? ""}
                  className="input mt-2"
                  placeholder="Evidence / audit remarks"
                />
                <button className="mt-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-700">
                  Update Control
                </button>
              </form>
            ))}
          </div>
        </section>
      </section>

      {/* Incident Register */}
      <section className="glass-card p-6">
        <h2 className="heading-font text-xl font-bold text-blue-950 mb-4">
          <Clock size={18} className="inline mr-2 text-blue-600" />
          Incident Register
        </h2>
        {incidents.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">
            No incidents recorded. Use the form above to create incident
            reports.
          </p>
        ) : (
          <div className="space-y-4">
            {incidents.map((i) => (
              <div
                key={i.id}
                className="rounded-2xl bg-white/75 p-5 border border-slate-100"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-950">{i.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {i.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>
                        Detected:{" "}
                        {i.detectedAt.toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span>·</span>
                      <span className="font-mono">
                        Hash: {i.evidenceHash?.slice(0, 16)}...
                      </span>
                      {i.reportedAt && (
                        <>
                          <span>·</span>
                          <span>
                            Reported:{" "}
                            {i.reportedAt.toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ColourTag value={i.severity} />
                    <ColourTag value={i.status} />
                  </div>
                </div>

                {i.status !== "RESOLVED" && (
                  <form
                    action={markIncidentReported}
                    className="mt-4 flex flex-col gap-2 sm:flex-row"
                  >
                    <input type="hidden" alt="id" value={i.id} />
                    <input
                      alt="reportReference"
                      className="input flex-1"
                      placeholder="CERT-In report/reference number"
                    />
                    <button className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800">
                      Mark as Reported
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
