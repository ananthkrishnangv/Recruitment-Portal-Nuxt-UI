import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const rows = await prisma.siteSetting.findMany({ orderBy:{key:'asc'} });
console.table(rows.map(r => ({ key:r.key, value:r.isSecret ? '***MASKED***' : JSON.stringify(r.value), secret:r.isSecret })));
await prisma.$disconnect();
