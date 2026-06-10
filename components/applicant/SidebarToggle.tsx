"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderOpen,
  User,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/applicant/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applicant/applications", label: "My Applications", icon: FileText },
  { href: "/applicant/apply", label: "Apply for Post", icon: PlusCircle },
  { href: "/applicant/documents", label: "Document Vault", icon: FolderOpen },
  { href: "/applicant/profile", label: "Profile", icon: User },
  { href: "/applicant/consent", label: "DPDP Consent", icon: ShieldCheck },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-col gap-1.5 px-3">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
              isActive
                ? "bg-white/20 text-white font-medium shadow-sm"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileSidebarToggle() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger button */}
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="md:hidden text-white hover:bg-white/20 px-2"
        aria-label="Open navigation menu"
        icon={<Menu className="h-5 w-5" />}
      />

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 bottom-0 z-50 w-72 bg-gradient-teams shadow-2xl transition-transform duration-300"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-sm font-bold text-white tracking-wider uppercase">
                Applicant Portal
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-white/70 hover:bg-white/10 hover:text-white px-2"
                aria-label="Close navigation menu"
                icon={<X className="h-5 w-5" />}
              />
            </div>

            <nav className="flex flex-col gap-1.5 px-3 mt-4">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white font-medium shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
