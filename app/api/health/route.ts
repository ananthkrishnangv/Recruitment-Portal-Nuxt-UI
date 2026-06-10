import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date().toISOString();

  // Check database connectivity
  let dbOk = false;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const status = dbOk ? "healthy" : "degraded";

  return NextResponse.json(
    {
      ok: dbOk,
      status,
      timestamp: now,
      uptime: process.uptime(),
      version: process.env.npm_package_version ?? "1.0.0",
      services: {
        database: dbOk ? "connected" : "disconnected",
      },
    },
    { status: dbOk ? 200 : 503 }
  );
}
