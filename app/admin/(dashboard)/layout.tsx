import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await getAdminSession();
  if (!ok) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
