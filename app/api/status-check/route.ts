import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const appNo = request.nextUrl.searchParams.get("appNo");

  if (!appNo || appNo.trim().length < 3) {
    return NextResponse.json(
      { ok: false, message: "Please provide a valid application number" },
      { status: 400 }
    );
  }

  try {
    const app = await prisma.application.findUnique({
      where: { applicationNo: appNo.trim() },
      select: {
        applicationNo: true,
        status: true,
        category: true,
        submittedAt: true,
        createdAt: true,
        updatedAt: true,
        paymentStatus: true,
        post: {
          select: {
            title: true,
            postCode: true,
            advertisementNo: true,
          },
        },
      },
    });

    if (!app) {
      return NextResponse.json(
        { ok: false, message: "Application not found. Please check the application number." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      application: {
        applicationNo: app.applicationNo,
        status: app.status,
        category: app.category,
        postTitle: app.post.title,
        postCode: app.post.postCode,
        advertisementNo: app.post.advertisementNo,
        paymentStatus: app.paymentStatus,
        submittedAt: app.submittedAt?.toISOString() ?? null,
        lastUpdated: app.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
