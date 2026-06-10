import crypto from "node:crypto";

function key() {
  const raw = process.env.FIELD_ENCRYPTION_KEY || "dev-only-32-character-key-000000";
  return crypto.createHash("sha256").update(raw).digest();
}

export function encryptField(plain: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

export function decryptField(payload?: string | null) {
  if (!payload) return null;
  const [ivB64, tagB64, encB64] = payload.split(".");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encB64, "base64")), decipher.final()]).toString("utf8");
}
