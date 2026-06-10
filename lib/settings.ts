import { prisma } from "@/lib/db/prisma";
export async function getSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return (row?.value as T) ?? fallback;
}
export async function getSettingsByPrefix(prefix: string) {
  return prisma.siteSetting.findMany({ where: { key: { startsWith: prefix } }, orderBy: { key: "asc" } });
}
