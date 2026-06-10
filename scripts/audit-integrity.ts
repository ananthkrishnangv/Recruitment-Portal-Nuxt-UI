import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const rows = await prisma.auditLog.findMany({ orderBy:{ createdAt:'asc' } });
let ok = true;
for (let i=1;i<rows.length;i++) if (rows[i].previousHash !== rows[i-1].currentHash) ok = false;
console.log(JSON.stringify({ auditRows: rows.length, chainLinksValid: ok }, null, 2));
await prisma.$disconnect();
