import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const incidents = await prisma.certInIncident.findMany({ orderBy: { detectedAt: "desc" } });
const controls = await prisma.securityControlCheck.findMany({ orderBy: { controlCode: "asc" } });
console.log(JSON.stringify({ generatedAt: new Date().toISOString(), incidents, controls }, null, 2));
await prisma.$disconnect();
