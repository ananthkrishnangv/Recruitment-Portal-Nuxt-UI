import { prisma } from "@/lib/db/prisma";
import { VacancyManager } from "@/components/admin/VacancyManager";

export default async function AdminVacanciesPage() {
  const posts = await prisma.recruitmentPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vacancies: {
        orderBy: { category: "asc" },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  const serialized = posts.map((p) => ({
    id: p.id,
    postCode: p.postCode,
    title: p.title,
    advertisementNo: p.advertisementNo,
    crucialDate: p.crucialDate.toISOString(),
    openingDate: p.openingDate.toISOString(),
    closingDate: p.closingDate.toISOString(),
    isActive: p.isActive,
    applicationCount: p._count.applications,
    vacancies: p.vacancies.map((v) => ({
      id: v.id,
      category: v.category,
      vacancyCount: v.vacancyCount,
      backlogCount: v.backlogCount,
      horizontalPwbdCount: v.horizontalPwbdCount,
      remarks: v.remarks,
    })),
  }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold text-teams-dark">
          Vacancy Management
        </h1>
        <p className="mt-2 text-sm text-foreground-500">
          Create, edit, and manage recruitment posts and vacancy allocations
        </p>
      </div>

      <VacancyManager posts={serialized} />
    </div>
  );
}
