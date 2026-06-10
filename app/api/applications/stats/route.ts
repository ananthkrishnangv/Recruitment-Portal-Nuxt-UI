import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const stats = await Promise.all([
      prisma.application.count(),
      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.application.groupBy({
        by: ["category"],
        _count: { category: true },
      }),
      prisma.recruitmentPost.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          postCode: true,
          _count: { select: { applications: true } },
        },
      }),
      prisma.user.count({ where: { role: "APPLICANT" } }),
      prisma.payment.count({ where: { status: "Success" } }),
    ]);

    const [
      totalApplications,
      byStatus,
      byCategory,
      byPost,
      totalApplicants,
      successfulPayments,
    ] = stats;

    return NextResponse.json({
      ok: true,
      totalApplications,
      totalApplicants,
      successfulPayments,
      byStatus: byStatus.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      byCategory: byCategory.map((c) => ({
        category: c.category,
        count: c._count.category,
      })),
      byPost: byPost.map((p) => ({
        postCode: p.postCode,
        title: p.title,
        applicationCount: p._count.applications,
      })),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
