import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowed = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
export async function saveUploadedFile(file: File, applicantId: string, documentType: string) {
  if (!allowed.has(file.type)) throw new Error("Unsupported file type. Upload PDF/JPEG/PNG/WebP only.");
  if (file.size > 5 * 1024 * 1024) throw new Error("File exceeds 5 MB limit.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const dir = path.join(process.cwd(), process.env.LOCAL_UPLOAD_DIR || "storage/uploads", applicantId);
  await mkdir(dir, { recursive: true });
  const safeType = documentType.replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  const filename = `${safeType}-${Date.now()}-${hash.slice(0, 12)}.${ext}`;
  const fullPath = path.join(dir, filename);
  await writeFile(fullPath, bytes);
  return { storageKey: path.relative(process.cwd(), fullPath), fileHash: hash, sizeBytes: bytes.length, mimeType: file.type, originalName: file.name };
}
