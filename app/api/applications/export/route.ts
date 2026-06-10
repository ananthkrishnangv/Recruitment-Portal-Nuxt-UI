import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/hash-chain";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const category = request.nextUrl.searchParams.get("category");
  const postId = request.nextUrl.searchParams.get("postId");
  const format = request.nextUrl.searchParams.get("format") || "csv";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (postId) where.postId = postId;

  const rows = await prisma.application.findMany({
    where,
    include: {
      applicant: { select: { name: true, mobile: true, email: true } },
      post: { select: { title: true, postCode: true, advertisementNo: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  await writeAuditLog({
    action: "APPLICATION_EXPORT",
    entityType: "Application",
    entityId: "bulk",
    afterJson: { count: rows.length, format, filters: { status, category, postId } },
  });

  if (format === "json") {
    return NextResponse.json({
      ok: true,
      count: rows.length,
      data: rows.map((r) => ({
        applicationNo: r.applicationNo,
        applicantName: r.applicant.name,
        applicantMobile: r.applicant.mobile,
        applicantEmail: r.applicant.email,
        postTitle: r.post.title,
        postCode: r.post.postCode,
        advertisementNo: r.post.advertisementNo,
        category: r.category,
        status: r.status,
        paymentStatus: r.paymentStatus ?? "",
        submittedAt: r.submittedAt?.toISOString() ?? "",
        dob: r.dob.toISOString().slice(0, 10),
      })),
    });
  }

  // CSV format
  const headers = [
    "Application No",
    "Applicant Name",
    "Mobile",
    "Email",
    "Post Title",
    "Post Code",
    "Adv No",
    "Category",
    "Status",
    "Payment",
    "Submitted",
    "DOB",
  ];

  const csvRows = rows.map((r) =>
    [
      r.applicationNo,
      `"${r.applicant.name}"`,
      r.applicant.mobile ?? "",
      r.applicant.email ?? "",
      `"${r.post.title}"`,
      r.post.postCode,
      r.post.advertisementNo,
      r.category,
      r.status,
      r.paymentStatus ?? "",
      r.submittedAt?.toISOString() ?? "",
      r.dob.toISOString().slice(0, 10),
    ].join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=applications-export-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
}
