"use client";
import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { ColourTag } from "./ColourTag";

type Row = { applicationNo: string; applicant: { name: string }; post: { title: string }; category: string; status: string; paymentStatus: string | null; submittedAt: string | null };
export function ApplicationGrid({ applications }: { applications: Row[] }) {
  const [view, setView] = useState("All Applications");
  const [query, setQuery] = useState("");
  const views = ["All Applications", "By Post Applied", "UNDER_SCRUTINY", "DEFICIENCY_RAISED", "RECOMMENDED", "Export View"];
  const rows = useMemo(() => applications.filter(a => `${a.applicant.name} ${a.applicationNo} ${a.post.title} ${a.status}`.toLowerCase().includes(query.toLowerCase()) && (view === "All Applications" || view === "By Post Applied" || view === "Export View" || a.status === view)), [applications, query, view]);
  function exportCsv() {
    const csv = ["Application No,Applicant,Post,Category,Status,Payment,Submitted", ...rows.map(r => `${r.applicationNo},${r.applicant.name},${r.post.title},${r.category},${r.status},${r.paymentStatus ?? ""},${r.submittedAt ?? ""}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `applications-${view}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  return <section className="glass-card overflow-hidden"><div className="border-b border-white/60 bg-white/60 p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{views.map(v => <button key={v} onClick={() => setView(v)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${view===v ? "bg-blue-700 text-white" : "bg-white/70 text-slate-700 hover:bg-blue-50"}`}>{v.replaceAll("_", " ")}</button>)}</div><button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white"><Download size={16}/> Export by View/Post</button></div><label className="mt-4 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-full outline-none" placeholder="Search application, post, name..." /></label></div><div className="overflow-x-auto"><table className="min-w-full border-separate border-spacing-0 text-sm"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr>{["Application", "Applicant", "Post Applied", "Category", "Status", "Payment", "Submitted"].map(h=><th key={h} className="border-b px-4 py-3 font-bold">{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.applicationNo} className="bg-white/70 hover:bg-blue-50/70"><td className="border-b px-4 py-3 font-bold text-blue-800">{r.applicationNo}</td><td className="border-b px-4 py-3">{r.applicant.name}</td><td className="border-b px-4 py-3">{r.post.title}</td><td className="border-b px-4 py-3"><ColourTag value={r.category}/></td><td className="border-b px-4 py-3"><ColourTag value={r.status}/></td><td className="border-b px-4 py-3"><ColourTag value={r.paymentStatus ?? "Pending"}/></td><td className="border-b px-4 py-3">{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : '—'}</td></tr>)}</tbody></table></div></section>;
}
