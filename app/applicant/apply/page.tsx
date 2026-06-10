import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getApplicantUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardFooter, Chip } from "@/components/ui/heroui";
import {
  Briefcase,
  Calendar,
  Hash,
  Users,
  ArrowRight,
  Search,
} from "lucide-react";

export default async function BrowsePostsPage() {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  const posts = await prisma.recruitmentPost.findMany({
    where: { isActive: true },
    include: {
      vacancies: true,
      _count: { select: { applications: true } },
    },
    orderBy: { closingDate: "asc" },
  });

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <section className="glass-card p-6 bg-teams-gray/20 border border-teams-border/40 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10">
            <Briefcase size={24} className="text-teams-ocean" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-teams-dark">
              Available Recruitment Posts
            </h1>
            <p className="mt-1 text-sm font-medium text-foreground-500">
              Browse current openings and start your application. Only active posts with open application windows are shown.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-children">
          {posts.map((post) => {
            const totalVacancies = post.vacancies.reduce(
              (sum, v) => sum + v.vacancyCount,
              0
            );
            const isClosingSoon =
              new Date(post.closingDate).getTime() - Date.now() <
              7 * 24 * 60 * 60 * 1000;

            return (
              <Card key={post.id}  className="border border-teams-border/40 flex flex-col hover:border-teams-ocean/40 transition-colors">
                <CardContent className="p-6 flex-1">
                  {/* Closing soon badge */}
                  {isClosingSoon && (
                    <div className="mb-4">
                      <Chip variant="danger" size="sm" variant="ghost" className="font-bold border border-danger/20">
                        CLOSING SOON
                      </Chip>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold leading-snug text-teams-dark mb-4">
                    {post.title}
                  </h2>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    <div className="flex items-center gap-2 text-sm text-foreground-600 font-medium bg-teams-gray/20 rounded-lg p-2 border border-teams-border/40">
                      <Hash size={16} className="text-teams-ocean" />
                      <span>{post.postCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground-600 font-medium bg-teams-gray/20 rounded-lg p-2 border border-teams-border/40">
                      <Briefcase size={16} className="text-success-600" />
                      <span className="truncate">Adv. {post.advertisementNo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground-600 font-medium bg-teams-gray/20 rounded-lg p-2 border border-teams-border/40">
                      <Calendar size={16} className="text-warning-600" />
                      <span className="truncate">Crucial: {formatDate(post.crucialDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground-600 font-medium bg-teams-gray/20 rounded-lg p-2 border border-teams-border/40">
                      <Users size={16} className="text-secondary-600" />
                      <span>{totalVacancies} vacancies</span>
                    </div>
                  </div>

                  {/* Closing date */}
                  <div className="mt-4 rounded-xl border border-danger/20 bg-danger-50/50 px-4 py-3">
                    <p className="text-sm font-medium text-danger-700/80">
                      <span className="font-bold text-danger-900">Closes:</span>{" "}
                      {formatDate(post.closingDate)}
                    </p>
                  </div>

                  {/* Category breakdown */}
                  {post.vacancies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.vacancies.map((v) => (
                        <Chip
                          key={v.id}
                          size="sm"
                          variant="primary"
                          className="border border-teams-ocean/20 font-semibold"
                        >
                          {v.category}: {v.vacancyCount}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {/* Eligibility overview (from JSON rule) */}
                  {post.eligibilityRule && (
                    <div className="mt-4 pt-4 border-t border-teams-border/30">
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground-500 mb-1">
                        Eligibility Overview
                      </p>
                      <p className="text-sm font-medium text-foreground-600 leading-relaxed">
                        Age and qualification requirements apply as per DoPT/CSIR
                        rules. Check detailed eligibility within the application form.
                      </p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-6 pt-0 border-t-0">
                  <Button
                    
                    href={`/applicant/apply/${post.postCode}`}
                    variant="primary"
                    className="w-full font-bold bg-teams-ocean shadow-md"
                    icon={<ArrowRight size={18} />}
                  >
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-teams-border/60 bg-teams-gray/10 p-16 text-center">
          <Search className="mx-auto h-16 w-16 text-foreground-300" />
          <h3 className="mt-6 text-2xl font-bold text-teams-dark">
            No Active Posts
          </h3>
          <p className="mt-2 text-base font-medium text-foreground-500">
            There are currently no open recruitment posts. Please check back later.
          </p>
          <Button
            
            href="/applicant/dashboard"
            variant="primary"
            className="mt-8 font-bold bg-teams-ocean/10 text-teams-ocean px-8"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

