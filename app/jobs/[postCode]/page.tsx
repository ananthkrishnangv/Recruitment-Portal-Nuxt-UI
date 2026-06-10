import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { GovtHeader } from "@/components/public/GovtHeader";
import { GovtFooter } from "@/components/public/GovtFooter";
import { Card, CardContent, Chip } from "@/components/ui/heroui";
import {
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  GraduationCap,
  Clock,
  Briefcase
} from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ postCode: string }>;
}) {
  const { postCode } = await params;

  const post = await prisma.recruitmentPost.findUnique({
    where: { postCode },
    include: {
      vacancies: { orderBy: { category: "asc" } },
      _count: { select: { applications: true } },
    },
  });

  if (!post) notFound();

  const totalVacancies = post.vacancies.reduce((s, v) => s + v.vacancyCount, 0);
  const eligibility = post.eligibilityRule as Record<string, unknown> | null;
  const feeRule = post.feeRule as Record<string, number> | null;
  const isOpen = post.isActive && new Date() <= post.closingDate;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <GovtHeader />
      
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="bg-gradient-teams relative overflow-hidden px-6 py-12 lg:px-8">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-teams-slate/20 blur-3xl opacity-50" />
          <div className="mx-auto max-w-5xl relative z-10 animate-fade-in-up">
            <Link
              href="/jobs"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg"
            >
              <ArrowLeft size={16} />
              Back to All Vacancies
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Chip 
                color={isOpen ? "success" : "default"} 
                variant="ghost" 
                size="sm" 
                startContent={<div className={`h-1.5 w-1.5 ml-1 rounded-full ${isOpen ? "bg-success" : "bg-foreground-400"}`}/>}
                className={`font-semibold border-none ${isOpen ? "bg-success/20 text-success-200" : "bg-white/20 text-white"}`}
              >
                {isOpen ? "Open for Applications" : "Closed"}
              </Chip>
              <span className="text-xs font-bold text-white/70 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-md">
                {post.advertisementNo}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold md:text-4xl text-white mt-2">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-white/80 font-medium">
              Post Code: {post.postCode} <span className="mx-2 opacity-50">|</span> CSIR-SERC, Chennai
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-white/90">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar size={16} className="text-success-300" />
                <span>Opening: {post.openingDate.toLocaleDateString("en-IN")}</span>
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock size={16} className="text-warning-300" />
                <span>Closing: {post.closingDate.toLocaleDateString("en-IN")}</span>
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar size={16} className="text-blue-300" />
                <span>Crucial Date: {post.crucialDate.toLocaleDateString("en-IN")}</span>
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Users size={16} className="text-teams-slate" />
                <span>{totalVacancies} Vacancies</span>
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-start">
            
            {/* Main Content */}
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Vacancy Matrix */}
              <Card className="border border-teams-border/40 shadow-sm">
                <CardContent className="p-0">
                  <div className="px-6 py-5 border-b border-teams-border/40 bg-teams-gray/30 flex items-center gap-3">
                    <Briefcase className="text-teams-ocean" size={20}/>
                    <h2 className="text-lg font-bold text-teams-dark">Category-wise Vacancy Matrix</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-teams-border/40 text-xs font-bold text-foreground-500 uppercase tracking-wider bg-teams-gray/10">
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Vacancies</th>
                          <th className="px-6 py-4">Backlog</th>
                          <th className="px-6 py-4">PwBD Horizontal</th>
                          <th className="px-6 py-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teams-border/20 text-sm">
                        {post.vacancies.map((v) => (
                          <tr key={v.id} className="hover:bg-teams-gray/20 transition-colors">
                            <td className="px-6 py-4">
                              <Chip size="sm" variant="primary" className="bg-teams-ocean/10 text-teams-ocean font-bold">{v.category}</Chip>
                            </td>
                            <td className="px-6 py-4 font-bold text-teams-dark">{v.vacancyCount}</td>
                            <td className="px-6 py-4 text-foreground-600">{v.backlogCount}</td>
                            <td className="px-6 py-4 text-foreground-600">{v.horizontalPwbdCount}</td>
                            <td className="px-6 py-4 text-foreground-500 text-xs">{v.remarks}</td>
                          </tr>
                        ))}
                        <tr className="bg-teams-ocean/5 font-bold">
                          <td className="px-6 py-4 text-teams-dark">Total</td>
                          <td className="px-6 py-4 text-teams-ocean text-lg">{totalVacancies}</td>
                          <td className="px-6 py-4 text-teams-dark">{post.vacancies.reduce((s, v) => s + v.backlogCount, 0)}</td>
                          <td className="px-6 py-4 text-teams-dark">{post.vacancies.reduce((s, v) => s + v.horizontalPwbdCount, 0)}</td>
                          <td className="px-6 py-4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility */}
              {eligibility && (
                <Card className="border border-teams-border/40 shadow-sm">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-teams-dark mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teams-ocean/10 text-teams-ocean">
                        <GraduationCap size={20} />
                      </div>
                      Eligibility Criteria
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Boolean(eligibility.essentialQualification) && (
                        <div className="rounded-xl border border-teams-border/30 bg-teams-gray/30 p-5">
                          <p className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-2">Essential Qualification</p>
                          <p className="font-semibold text-teams-dark text-sm">{String(eligibility.essentialQualification)}</p>
                        </div>
                      )}
                      {Boolean(eligibility.maxAge) && (
                        <div className="rounded-xl border border-teams-border/30 bg-teams-gray/30 p-5">
                          <p className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-2">Maximum Age</p>
                          <p className="font-semibold text-teams-dark text-lg">{String(eligibility.maxAge)} <span className="text-sm font-normal text-foreground-500">years</span></p>
                        </div>
                      )}
                      {eligibility.minimumExperienceYears !== undefined && (
                        <div className="rounded-xl border border-teams-border/30 bg-teams-gray/30 p-5">
                          <p className="text-xs font-bold text-foreground-500 uppercase tracking-widest mb-2">Minimum Experience</p>
                          <p className="font-semibold text-teams-dark text-lg">{String(eligibility.minimumExperienceYears)} <span className="text-sm font-normal text-foreground-500">years</span></p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fee Structure */}
              {feeRule && (
                <Card className="border border-teams-border/40 shadow-sm">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl font-bold text-teams-dark mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success-600">
                        <IndianRupee size={20} />
                      </div>
                      Application Fee
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {Object.entries(feeRule).map(([cat, amount]) => (
                        <div key={cat} className="flex items-center justify-between rounded-xl border border-teams-border/30 bg-white p-4 shadow-sm">
                          <span className="text-sm font-bold text-foreground-600">{cat}</span>
                          <span className={`font-black text-lg ${amount === 0 ? "text-success-600" : "text-teams-dark"}`}>
                            {amount === 0 ? "Exempted" : `₹${amount}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Important Dates */}
              <Card className="border border-teams-border/40 shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl font-bold text-teams-dark mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning-600">
                      <Clock size={20} />
                    </div>
                    Important Dates
                  </h2>
                  <div className="space-y-3">
                    {[
                      ["Opening Date", post.openingDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
                      ["Closing Date", post.closingDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
                      ["Crucial Date for Eligibility", post.crucialDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
                    ].map(([label, date]) => (
                      <div key={label} className="flex items-center justify-between rounded-xl border border-teams-border/20 bg-teams-gray/20 p-4">
                        <span className="text-sm font-semibold text-foreground-600">{label}</span>
                        <span className="font-bold text-teams-dark">{date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply CTA */}
              <Card className="border border-teams-border/40 shadow-lg bg-white overflow-visible relative animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                {isOpen && <div className="absolute -top-3 inset-x-0 mx-auto w-fit bg-success text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">ACCEPTING NOW</div>}
                <CardContent className="p-8 text-center flex flex-col items-center">
                  {isOpen ? (
                    <>
                      <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} className="text-success" />
                      </div>
                      <h3 className="text-xl font-bold text-teams-dark">Applications Open</h3>
                      <p className="mt-2 text-sm text-foreground-500 font-medium bg-teams-gray px-3 py-1 rounded-md">
                        Last date: <strong className="text-teams-dark">{post.closingDate.toLocaleDateString("en-IN")}</strong>
                      </p>
                      <Button as={Link} href="/auth/login" variant="primary" size="lg" className="w-full font-bold shadow-md bg-teams-ocean text-white mt-8 mb-3">
                        Apply Now
                      </Button>
                      <p className="text-xs font-semibold text-foreground-400">Login or Register to start</p>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 rounded-full bg-foreground-100 flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-foreground-400" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground-600">Applications Closed</h3>
                      <p className="mt-2 text-sm text-foreground-500 leading-relaxed max-w-[200px] mx-auto">
                        This vacancy is no longer accepting applications.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="border border-teams-border/40 shadow-sm bg-teams-gray/20 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-teams-dark mb-5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teams-ocean"></span>
                    Quick Info
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center border-b border-teams-border/30 pb-3">
                      <span className="font-semibold text-foreground-500">Post Code</span>
                      <span className="font-bold text-teams-dark bg-white px-2 py-1 rounded border border-teams-border/30 shadow-sm">{post.postCode}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-teams-border/30 pb-3">
                      <span className="font-semibold text-foreground-500">Total Vacancies</span>
                      <span className="font-bold text-teams-dark">{totalVacancies}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-teams-border/30 pb-3">
                      <span className="font-semibold text-foreground-500">Applications</span>
                      <span className="font-bold text-teams-dark">{post._count.applications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground-500">Location</span>
                      <span className="font-bold text-teams-dark">Chennai</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="border border-teams-border/40 shadow-sm bg-white animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-sm font-bold text-teams-dark mb-2">Need Help?</h3>
                  <p className="text-xs text-foreground-500 leading-relaxed mb-4">
                    Contact the recruitment helpdesk for queries.
                  </p>
                  <a href="mailto:recruitment-helpdesk@serc.res.in" className="text-sm font-bold text-teams-ocean hover:text-teams-ocean/80 transition-colors bg-teams-ocean/5 px-3 py-2 rounded-lg inline-block">
                    recruitment-helpdesk@serc.res.in
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <GovtFooter />
    </div>
  );
}
