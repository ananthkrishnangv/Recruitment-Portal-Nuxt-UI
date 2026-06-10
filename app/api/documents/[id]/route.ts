import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Check both vault documents and application documents
    let storageKey: string | null = null;
    let mimeType: string = "application/octet-stream";
    let originalName: string = "document";

    const vaultDoc = await prisma.applicantDocument.findUnique({
      where: { id },
      select: { storageKey: true, mimeType: true, originalName: true },
    });

    if (vaultDoc) {
      storageKey = vaultDoc.storageKey;
      mimeType = vaultDoc.mimeType;
      originalName = vaultDoc.originalName;
    } else {
      const appDoc = await prisma.applicationDocument.findUnique({
        where: { id },
        select: { storageKey: true, mimeType: true, originalName: true },
      });

      if (appDoc) {
        storageKey = appDoc.storageKey;
        mimeType = appDoc.mimeType;
        originalName = appDoc.originalName;
      }
    }

    if (!storageKey) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const fullPath = path.join(process.cwd(), storageKey);
    const fileBuffer = await readFile(fullPath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${originalName}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
