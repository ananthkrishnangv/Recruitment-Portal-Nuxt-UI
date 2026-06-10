import { prisma } from "@/lib/db/prisma";
import { ColourTag } from "@/components/admin/ColourTag";
import { Scale, Calendar, Users, FileText, AlertCircle } from "lucide-react";

export const metadata = {
  title: "DoPT Recruitment Rules",
};

export default async function RecruitmentRulesPage() {
  const posts = await prisma.recruitmentPost.findMany({
    include: { vacancies: true, _count: { select: { applications: true } } },
    orderBy: { postCode: "asc" },
  });

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <section className="glass-card p-6 bg-teams-gray/20 border border-teams-border/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10">
            <Scale size={24} className="text-teams-ocean" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teams-dark">
              DoPT / CSIR Recruitment Rules & Vacancy Matrix
            </h1>
            <p className="mt-1 text-sm text-foreground-500 font-medium">
              Category-wise vacancy allocations (SC, ST, OBC, UR, EWS, PwBD) with eligibility rules and fee structures per recruitment post.
            </p>
          </div>
        </div>
      </section>

      {/* Age Relaxation Reference */}
      <section className="glass-card p-6">
        <h2 className="heading-font text-xl font-bold text-blue-950 mb-4">
          <AlertCircle size={18} className="inline mr-2 text-amber-600" />
          DoPT Age Relaxation Rules (Standard Reference)
        </h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Relaxation (Years)</th>
                <th>Applicable Rule</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["UR (General)", "0", "No relaxation"],
                ["OBC (Non-Creamy Layer)", "3", "DoPT OM 36012/22/93-Estt.(SCT)"],
                ["SC / ST", "5", "DoPT OM 36012/22/93-Estt.(SCT)"],
                ["PwBD (General)", "10", "DoPT OM 36035/3/2004-Estt.(Res.)"],
                ["PwBD + OBC", "13 (10+3)", "Combined relaxation"],
                ["PwBD + SC/ST", "15 (10+5)", "Combined relaxation"],
                ["Ex-Servicemen", "Actual military service + 3", "DoPT OM 36034/1/2014-Estt.(Res.)"],
                ["EWS", "0", "Subject to income/asset criteria; DoPT OM 36039/1/2019-Estt.(Res.)"],
              ].map(([cat, relaxation, rule]) => (
                <tr key={cat}>
                  <td className="font-semibold text-blue-950">{cat}</td>
                  <td>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                      {relaxation}
                    </span>
                  </td>
                  <td className="text-sm text-slate-600">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Post-wise Details */}
      {posts.map((post) => {
        const totalVacancies = post.vacancies.reduce(
          (a, b) => a + b.vacancyCount,
          0
        );
        const eligibility = post.eligibilityRule as Record<string, unknown> | null;
        const feeRule = post.feeRule as Record<string, number> | null;

        return (
          <section key={post.id} className="glass-card p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="heading-font text-xl font-bold text-blue-950">
                    {post.title}
                  </h2>
                  {post.isActive ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-600">
                      Closed
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <FileText size={14} className="text-blue-600" />
                    {post.postCode} · {post.advertisementNo}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-blue-600" />
                    Crucial Date:{" "}
                    {post.crucialDate.toLocaleDateString("en-IN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} className="text-blue-600" />
                    {post._count.applications} applications
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800">
                Total Vacancies: {totalVacancies}
              </span>
            </div>

            {/* Vacancy Matrix */}
            <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              {post.vacancies.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl bg-white/75 p-4 border border-slate-100"
                >
                  <ColourTag value={v.category} />
                  <p className="mt-3 text-2xl font-bold text-blue-950">
                    {v.vacancyCount}
                  </p>
                  <div className="mt-1 space-y-0.5 text-xs text-slate-600">
                    <p>Backlog: {v.backlogCount}</p>
                    <p>PwBD Horizontal: {v.horizontalPwbdCount}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Eligibility & Fee Rules */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {eligibility && (
                <div className="rounded-2xl bg-white/75 p-4 border border-slate-100">
                  <h3 className="font-bold text-blue-950 mb-2">
                    Eligibility Rule
                  </h3>
                  <pre className="overflow-auto text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl">
                    {JSON.stringify(eligibility, null, 2)}
                  </pre>
                </div>
              )}
              {feeRule && (
                <div className="rounded-2xl bg-white/75 p-4 border border-slate-100">
                  <h3 className="font-bold text-blue-950 mb-2">Fee Rule</h3>
                  <div className="space-y-1">
                    {Object.entries(feeRule).map(([cat, amount]) => (
                      <div
                        key={cat}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-slate-600">{cat}</span>
                        <span
                          className={`font-bold ${
                            amount === 0
                              ? "text-emerald-600"
                              : "text-blue-950"
                          }`}
                        >
                          {amount === 0 ? "Exempted" : `₹${amount}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {posts.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Scale size={48} className="mx-auto text-slate-300" />
          <h3 className="heading-font mt-4 text-xl font-bold text-slate-600">
            No recruitment posts configured
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Create posts from the Vacancies management page.
          </p>
        </div>
      )}
    </div>
  );
}
