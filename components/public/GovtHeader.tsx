"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, LogIn, ShieldCheck, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Current Vacancies", href: "/jobs", icon: Briefcase },
];

export function GovtHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-teams-border/40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-teams text-lg font-bold text-white shadow-md">
              CS
            </div>
            <div className="hidden sm:block">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-teams-ocean">
                Government of India · CSIR-SERC
              </p>
              <p className="text-base font-bold text-teams-dark leading-tight">
                Recruitment Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors ${
                    isActive ? "text-teams-ocean font-semibold" : "text-foreground-600 hover:text-teams-ocean"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon size={16} className={isActive ? "text-teams-ocean" : "opacity-70"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant="ghost" 
              href="/auth/login" 
              icon={<LogIn size={16} />}
              className="font-medium bg-teams-ocean/10 text-teams-ocean hover:bg-teams-ocean/20"
            >
              Applicant Login
            </Button>
            <Button 
              variant="primary" 
              href="/admin/login" 
              icon={<ShieldCheck size={16} />}
              className="font-medium bg-teams-ocean text-white shadow-md hover:bg-teams-ocean/90"
            >
              Admin
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-foreground-600 hover:text-teams-ocean focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden glass-panel border-t border-teams-border/40">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 py-3 px-2 text-base rounded-md ${
                    isActive ? "text-teams-ocean font-semibold bg-teams-ocean/5" : "text-foreground-700 hover:bg-teams-gray/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={20} className={isActive ? "text-teams-ocean" : "opacity-60"} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-teams-border/30 flex flex-col gap-3">
              <Button 
                variant="ghost" 
                href="/auth/login" 
                icon={<LogIn size={18} />}
                className="w-full justify-start font-medium bg-teams-ocean/10 text-teams-ocean"
                onClick={() => setIsMenuOpen(false)}
              >
                Applicant Login
              </Button>
              <Button 
                variant="primary" 
                href="/admin/login" 
                icon={<ShieldCheck size={18} />}
                className="w-full justify-start font-medium bg-teams-ocean text-white shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
