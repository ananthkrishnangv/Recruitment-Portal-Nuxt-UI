import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { GovtHeader } from "@/components/public/GovtHeader";
import { GovtFooter } from "@/components/public/GovtFooter";
import { Card, CardContent, Chip } from "@/components/ui/heroui";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Briefcase,
  Clock,
  FileText,
  Search,
} from "lucide-react";

export const metadata = {
  title: "Current Vacancies",
  description: "Browse current recruitment vacancies at CSIR-SERC",
};

export default async function JobsPage() {
  const posts = await prisma.recruitmentPost.findMany({
    include: {
      vacancies: true,
      _count: { select: { applications: true } },
    },
    orderBy: { closingDate: "desc" },
  });

  const activePosts = posts.filter((p) => p.isActive);
  const closedPosts = posts.filter((p) => !p.isActive);
  const totalVacancies = posts.reduce(
    (sum, p) => sum + p.vacancies.reduce((s, v) => s + v.vacancyCount, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <GovtHeader />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <section className="bg-gradient-teams relative overflow-hidden px-6 py-16 lg:px-8">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-teams-slate/20 blur-3xl opacity-50" />
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="animate-fade-in-up">
              <Chip 
                startContent={<Briefcase size={14} />} 
                variant="primary" 
                className="bg-white/10 text-white border-white/20 mb-6"
              >
                CSIR-SERC Recruitment
              </Chip>
              <h1 className="text-4xl font-bold md:text-5xl text-white">
                Current Vacancies
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/80">
                Browse open recruitment positions at the Council of Scientific &
                Industrial Research — Structural Engineering Research Centre,
                Chennai.
              </p>
              
              <div className="mt-10 grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6">
                <Card className="bg-white/10 border-white/10 shadow-none">
                  <CardContent className="flex flex-row items-center gap-4 py-4 px-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{activePosts.length}</p>
                      <p className="text-xs text-white/70 uppercase tracking-wide font-semibold mt-1">Active Posts</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/10 shadow-none">
                  <CardContent className="flex flex-row items-center gap-4 py-4 px-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{totalVacancies}</p>
                      <p className="text-xs text-white/70 uppercase tracking-wide font-semibold mt-1">Total Vacancies</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-16">
          {/* Active Vacancies */}
          {activePosts.length > 0 && (
            <section className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-teams-dark mb-8 flex items-center gap-2">
                Open Vacancies
              </h2>
              <div className="grid gap-6">
                {activePosts.map((post) => {
                  const totalVac = post.vacancies.reduce((s, v) => s + v.vacancyCount, 0);
                  const isClosingSoon = post.closingDate && new Date(post.closingDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <Card key={post.id} className="border border-teams-border/40 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Chip variant="ghost" size="sm" startContent={<div className="h-1.5 w-1.5 ml-1 rounded-full bg-success"/>} className="bg-success/10 text-success-600 font-semibold border-none">
                                Active
                              </Chip>
                              {isClosingSoon && (
                                <Chip variant="ghost" size="sm" startContent={<Clock size={12}/>} className="bg-warning/10 text-warning-600 font-semibold border-none">
                                  Closing Soon
                                </Chip>
                              )}
                              <span className="text-sm font-semibold text-foreground-500 bg-teams-gray px-3 py-1 rounded-md">
                                {post.advertisementNo}
                              </span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-teams-dark">
                              {post.title}
                            </h3>
                            <p className="mt-2 text-sm font-medium text-teams-ocean">
                              Post Code: {post.postCode}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground-600">
                              <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-success" />
                                <span>Opens: <strong className="text-teams-dark">{post.openingDate.toLocaleDateString("en-IN")}</strong></span>
                              </span>
                              <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-danger" />
                                <span>Closes: <strong className="text-teams-dark">{post.closingDate.toLocaleDateString("en-IN")}</strong></span>
                              </span>
                              <span className="flex items-center gap-2">
                                <MapPin size={16} className="text-teams-slate" />
                                <span>Chennai, Tamil Nadu</span>
                              </span>
                            </div>

                            {/* Category Vacancies */}
                            <div className="mt-6 flex flex-wrap gap-2 items-center">
                              <span className="text-xs font-semibold text-foreground-500 mr-2 uppercase tracking-wide">Vacancies:</span>
                              {post.vacancies.map((v) => (
                                <Chip key={v.id} size="sm" variant="primary" className="bg-teams-ocean/10 text-teams-ocean font-semibold">
                                  {v.category}: {v.vacancyCount}
                                </Chip>
                              ))}
                              <Chip size="sm" variant="primary" className="bg-teams-ocean text-white font-bold ml-1 shadow-sm">
                                Total: {totalVac}
                              </Chip>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4 lg:items-end w-full lg:w-auto pt-4 lg:pt-0 border-t border-teams-border/40 lg:border-none">
                            <div className="flex items-center gap-2 bg-teams-gray px-4 py-2 rounded-lg text-sm text-foreground-600 w-full lg:w-auto justify-center lg:justify-end">
                              <Users size={16} className="text-teams-slate" />
                              <span><strong>{post._count.applications}</strong> applications received</span>
                            </div>
                            <Button
                              
                              href={`/jobs/${post.postCode}`}
                              variant="primary"
                              size="lg"
                              className="w-full lg:w-auto font-bold shadow-md bg-teams-ocean text-white mt-2"
                              icon={<ArrowRight size={18} />}
                            >
                              View Details & Apply
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Closed Vacancies */}
          {closedPosts.length > 0 && (
            <section className="mt-16 animate-fade-in-up">
              <h2 className="text-xl font-bold text-foreground-500 mb-6 uppercase tracking-wider text-sm flex items-center gap-4">
                Closed / Past Vacancies
                <div className="h-px bg-teams-border/50 flex-1"></div>
              </h2>
              <div className="grid gap-4">
                {closedPosts.map((post) => (
                  <Card key={post.id} className="border border-teams-border/30 bg-teams-gray/30 shadow-none hover:bg-teams-gray/50 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Chip size="sm" className="bg-foreground-200 text-foreground-600 font-bold border-none">Closed</Chip>
                            <span className="text-xs font-semibold text-foreground-500">{post.advertisementNo}</span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground-700">{post.title}</h3>
                          <p className="text-sm text-foreground-500 mt-1">
                            {post.postCode} · Closed {post.closingDate.toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <Button
                          
                          href={`/jobs/${post.postCode}`}
                          variant="ghost"
                          className="text-teams-ocean font-semibold mt-2 md:mt-0"
                          icon={<ArrowRight size={16} />}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {posts.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="h-24 w-24 rounded-3xl bg-teams-gray flex items-center justify-center mb-6">
                <Search size={40} className="text-teams-slate" />
              </div>
              <h3 className="text-2xl font-bold text-teams-dark">No vacancies at this time</h3>
              <p className="mt-3 text-foreground-500 max-w-md">
                Please check back later for new recruitment advertisements or check the main CSIR website.
              </p>
              <Button  href="/" variant="ghost" className="mt-8 font-semibold">
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </main>
      <GovtFooter />
    </div>
  );
}

