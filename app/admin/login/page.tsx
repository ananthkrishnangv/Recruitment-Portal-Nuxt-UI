import { Button } from "@/components/ui/button";
import { adminLogin } from "@/app/actions/auth";
import { Input, Card, CardContent } from "@/components/ui/heroui";
import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  LogIn,
  ClipboardCheck,
  Workflow,
  BarChart3,
  ScrollText,
  Lock,
  AlertTriangle,
} from "lucide-react";

const FEATURES = [
  { icon: ClipboardCheck, label: "Application Review & Processing" },
  { icon: Workflow, label: "Scrutiny Workflow Management" },
  { icon: BarChart3, label: "Analytics Dashboard & Reports" },
  { icon: ScrollText, label: "Comprehensive Audit Logs" },
];

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-[#fafafa]">
      {/* ──────────── LEFT PANEL — Gradient Hero ──────────── */}
      <aside className="relative hidden md:flex flex-col justify-center overflow-hidden bg-gradient-teams px-10 lg:px-16">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-teams-iris/30 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-teams-dark/30 blur-3xl opacity-50" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 animate-fade-in">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm border border-white/20">
            <Lock size={14} />
            Authorized Access Only
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white lg:text-5xl leading-tight">
            CSIR-SERC
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white mt-2">Admin Portal</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
            Scrutiny &amp; Administration Console for Recruitment Management
          </p>

          {/* Feature list */}
          <div className="mt-12 space-y-6">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 text-white/90">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/5">
                  <Icon size={20} className="text-blue-200" />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
            <ShieldCheck size={14} />
            <span>CVC Audit Trail · Role-Based Access · Session Monitored</span>
          </div>
        </div>
      </aside>

      {/* ──────────── RIGHT PANEL — Admin Login Form ──────────── */}
      <section className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 relative">
        <div className="absolute inset-0 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.05)] rounded-l-[3rem] z-0 hidden md:block" />

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          {/* Mobile-only heading */}
          <div className="mb-8 text-center md:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-teams shadow-lg">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-teams-dark">CSIR-SERC Admin Portal</h1>
            <p className="mt-2 text-sm text-foreground-500">Scrutiny &amp; Administration Console</p>
          </div>

          <Card className="border border-teams-border/40 shadow-xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="mb-8 text-center hidden md:block">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teams-ocean/10 text-teams-ocean shadow-sm">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-bold text-teams-dark">Administrative Access</h2>
                <p className="mt-2 text-sm text-foreground-500">Enter your credentials to access the console</p>
              </div>

              {/* Security Notice */}
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning-600" />
                <p className="text-xs leading-relaxed text-warning-800">
                  <strong>Restricted Area.</strong> Authorized personnel only.
                  All access attempts are recorded in the audit log and monitored for security compliance.
                </p>
              </div>

              {/* Login Form */}
              <form action={async (formData) => { "use server"; await adminLogin(formData); }} className="space-y-6">
                <div>
                  <Input
                    type="password"
                    name="pin"
                    label="Admin PIN / Password"
                    placeholder="Enter admin PIN"
                    isRequired
                    variant="bordered"
                    labelPlacement="outside"
                    startContent={<KeyRound size={16} className="text-foreground-400" />}
                    classNames={{
                      label: "text-foreground-700 font-semibold text-xs",
                      inputWrapper: "bg-white shadow-sm border-teams-border/60 focus-within:border-teams-ocean focus-within:ring-1 focus-within:ring-teams-ocean",
                      input: "tracking-[0.2em] font-mono text-center"
                    }}
                  />
                  <p className="text-xs text-foreground-500 mt-2 flex items-center gap-1 justify-center">
                    <KeyRound size={12} />
                    Demo PIN: <strong className="text-teams-ocean">123456</strong>
                  </p>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md" icon={<LogIn size={18} />}>
                  Login to Admin Portal
                </Button>
              </form>

              {/* Audit Log Notice */}
              <div className="mt-8 rounded-xl border border-teams-border/40 bg-teams-gray/50 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-teams-dark">
                  <ScrollText size={14} className="text-teams-ocean" />
                  All sessions are audit-logged
                </div>
                <p className="mt-2 text-xs text-foreground-500 leading-relaxed">
                  Login time, actions, and IP addresses are recorded for CVC-compliant transparency and accountability.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 text-center text-xs font-medium text-foreground-400">
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/login" className="text-teams-ocean hover:text-teams-ocean/80 transition-colors">
                ← Applicant Login
              </Link>
              <span className="text-teams-border/50">|</span>
              <Link href="/" className="text-teams-ocean hover:text-teams-ocean/80 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
