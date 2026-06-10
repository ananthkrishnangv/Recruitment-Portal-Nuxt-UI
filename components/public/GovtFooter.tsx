"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Globe,
  Accessibility,
  Eye,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Current Vacancies", href: "/jobs" },
  { label: "Apply Online", href: "/jobs" },
  { label: "Applicant Login", href: "/auth/login" },
  { label: "Register", href: "/auth/login" },
];

const complianceItems = [
  { label: "DPDP Act 2023", icon: ShieldCheck },
  { label: "GIGW Guidelines", icon: Globe },
  { label: "WCAG 2.1 AA", icon: Accessibility },
  { label: "CVC Transparency", icon: Eye },
];

export function GovtFooter() {
  return (
    <footer className="mt-16 bg-teams-gray">
      {/* ── Top Gradient Accent ── */}
      <div className="h-1 w-full bg-gradient-teams" />

      {/* ── Main Footer Grid ── */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: About CSIR-SERC */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-teams text-sm font-bold text-white shadow-sm">
              CS
            </div>
            <h3 className="text-lg font-semibold text-teams-dark tracking-tight">
              CSIR-SERC
            </h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground-600">
            CSIR-Structural Engineering Research Centre
          </p>
          <div className="mt-4 flex items-start gap-3 text-sm text-foreground-600">
            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-teams-ocean" />
            <span>
              CSIR Campus, Taramani,
              <br />
              Chennai – 600 113, Tamil Nadu, India
            </span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-teams-dark">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group flex w-fit items-center gap-2 text-sm text-foreground-600 transition-colors hover:text-teams-ocean"
                >
                  <ExternalLink
                    size={14}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Helpdesk */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-teams-dark">
            Helpdesk
          </h3>
          <div className="mt-5 space-y-4">
            <a
              href="mailto:recruitment-helpdesk@serc.res.in"
              className="flex w-fit items-center gap-3 text-sm text-foreground-600 transition-colors hover:text-teams-ocean"
            >
              <Mail size={16} className="text-teams-ocean" />
              recruitment-helpdesk@serc.res.in
            </a>
            <a
              href="tel:+914422549000"
              className="flex w-fit items-center gap-3 text-sm text-foreground-600 transition-colors hover:text-teams-ocean"
            >
              <Phone size={16} className="text-success" />
              044-2254-9000
            </a>
            <div className="rounded-lg bg-white/60 p-3 text-xs text-foreground-500 shadow-sm border border-teams-border/50">
              <span className="font-medium text-teams-dark">Helpdesk Hours:</span><br/>
              Mon–Fri, 9:30 AM – 5:30 PM IST<br/>
              (Excluding Government Holidays)
            </div>
          </div>
        </div>

        {/* Col 4: Compliance */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-teams-dark">
            Compliance
          </h3>
          <ul className="mt-5 space-y-3">
            {complianceItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                  <item.icon size={12} />
                </div>
                <span className="text-sm font-medium text-foreground-600">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr className="my-8 border-t border-teams-border/50 max-w-7xl mx-auto" />

      {/* ── Bottom Bar ── */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-6 text-center text-xs text-foreground-500 sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {new Date().getFullYear()} CSIR-SERC. All rights reserved.
        </p>
        <p>
          Designed &amp; Developed for CSIR-SERC
        </p>
        <p>
          Last Updated: June 2026
        </p>
      </div>
    </footer>
  );
}
