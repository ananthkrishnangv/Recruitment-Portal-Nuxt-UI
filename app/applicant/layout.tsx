import { redirect } from "next/navigation";
import { getApplicantUser } from "@/lib/auth/session";
import { logout } from "@/app/actions/auth";
import { SidebarNav, MobileSidebarToggle } from "@/components/applicant/SidebarToggle";
import { LogOut } from "lucide-react";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getApplicantUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden w-64 shrink-0 flex-col md:flex"
        style={{ background: "var(--gradient-sidebar)" }}
      >
        {/* Sidebar Header */}
        <div className="px-5 pt-6 pb-2">
          <h1 className="heading-font text-lg font-bold leading-tight text-white">
            CSIR-SERC
          </h1>
          <p className="text-xs font-medium text-white/60">
            Recruitment Portal
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3">
          <SidebarNav />
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs font-medium text-white/70">
            {user.name}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Column ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 shadow-sm md:px-6"
          style={{ background: "var(--gradient-sidebar)" }}
        >
          <div className="flex items-center gap-3">
            <MobileSidebarToggle />
            <h2 className="heading-font text-sm font-bold text-white md:text-base">
              CSIR-SERC Recruitment Portal
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-medium text-white/80 sm:block">
              Welcome, {user.name}
            </span>
            <form action={logout} className="hidden md:block">
              <button
                type="submit"
                className="focus-ring flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </form>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 gradient-shell">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
