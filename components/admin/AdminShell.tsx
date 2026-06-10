"use client";
import { Button } from "@/components/ui/button";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, Avatar } from "@/components/ui/heroui";
import {
  LayoutDashboard,
  Table2,
  ClipboardCheck,
  Briefcase,
  BarChart3,
  ScrollText,
  Settings,
  Scale,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: Table2 },
  { label: "Scrutiny", href: "/admin/scrutiny", icon: ClipboardCheck },
  { label: "Vacancies", href: "/admin/vacancies", icon: Briefcase },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/audit", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "DoPT Rules", href: "/admin/recruitment-rules", icon: Scale },
  { label: "CERT-In", href: "/admin/cert-in", icon: ShieldAlert },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => setCollapsed((c) => !c), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo / Brand Area */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-sm backdrop-blur-md">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-sm font-bold tracking-tight text-white">
              CSIR-SERC
            </p>
            <p className="text-[11px] font-medium text-white/70 tracking-wider uppercase">
              Admin Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto overflow-x-hidden pb-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          const LinkContent = (
            <Link
              href={item.href}
              onClick={closeMobile}
              className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                collapsed ? "justify-center p-3" : "px-3 py-2.5"
              } ${
                active 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="truncate text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} content={item.label} placement="right" className="bg-teams-dark text-white">
                <div>{LinkContent}</div>
              </Tooltip>
            );
          }

          return <div key={item.href}>{LinkContent}</div>;
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl bg-black/20 p-3">
            <Avatar size="sm" alt="Admin User" className="bg-white/20 text-white" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">Admin User</p>
              <p className="truncate text-[10px] text-white/60 uppercase">System Admin</p>
            </div>
            <Tooltip content="Logout">
              <Button
            variant="ghost"
            size="sm"
            href="/"
            className="text-foreground-500 hover:text-teams-dark"
            icon={<LogOut size={18} />}
          />
            </Tooltip>
          </div>
        ) : (
          <Tooltip content="Logout" placement="right" className="bg-teams-dark text-white">
            <Link
              href="/admin/login"
              className="flex justify-center rounded-lg p-3 text-white/70 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
            </Link>
          </Tooltip>
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-gradient-teams transition-all duration-300 md:flex ${
          collapsed ? "w-20" : "w-64"
        } shadow-xl`}
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#fafafa] bg-teams-ocean text-white shadow-md transition-colors hover:bg-teams-slate focus:outline-none"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gradient-teams transition-transform duration-300 md:hidden shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={closeMobile}
          className="absolute right-3 top-4 rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* ── Main Content ── */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-teams-border/40 bg-white/80 px-4 py-3 backdrop-blur-md md:hidden shadow-sm">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="ghost" onClick={() => setMobileOpen(true)} className="text-foreground-700">
              <Menu className="h-5 w-5" />
            </Button>
            <p className="text-sm font-bold text-teams-dark">
              Admin Portal
            </p>
          </div>
          <Avatar size="sm" alt="Admin" />
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
