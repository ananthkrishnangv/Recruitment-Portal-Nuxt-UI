"use client";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import Link from "next/link";
import { applicantLogin } from "@/app/actions/auth";
import { Input, Select, SelectItem, Checkbox, Tabs, Tab, Card, CardContent } from "@/components/ui/heroui";
import {
  CheckCircle2,
  Phone,
  KeyRound,
  UserPlus,
  LogIn,
  Search,
  ShieldCheck,
  FileText,
  CreditCard,
  Activity,
} from "lucide-react";

const FEATURES = [
  { icon: FileText, label: "Online Application & Document Vault" },
  { icon: ShieldCheck, label: "Secure Document Management" },
  { icon: CreditCard, label: "Payment Tracking & Receipts" },
  { icon: Activity, label: "Real-Time Status Updates" },
];

const CATEGORIES = [
  { value: "UR", label: "UR — Unreserved" },
  { value: "OBC", label: "OBC — Other Backward Class" },
  { value: "SC", label: "SC — Scheduled Caste" },
  { value: "ST", label: "ST — Scheduled Tribe" },
  { value: "EWS", label: "EWS — Economically Weaker" },
  { value: "PwBD", label: "PwBD — Persons with Disability" },
];

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-[#fafafa]">
      {/* ──────────── LEFT PANEL — Gradient Hero ──────────── */}
      <aside className="relative hidden md:flex flex-col justify-center overflow-hidden bg-gradient-hero px-10 lg:px-16">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-teams-slate/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-teams-iris/20 blur-3xl opacity-50" />

        {/* Content */}
        <div className="relative z-10 animate-fade-in">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-success-300 backdrop-blur-sm border border-white/10">
            <ShieldCheck size={16} />
            Government of India
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white lg:text-5xl leading-tight">
            CSIR-SERC
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-success-300 to-teams-slate mt-2">Recruitment Portal</span>
          </h1>

          {/* Tagline */}
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
            Transparent, Rule-Based Recruitment for Scientific &amp;
            Technical Positions
          </p>

          {/* Feature list */}
          <div className="mt-12 space-y-6">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 text-white/90">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/5">
                  <Icon size={20} className="text-success-300" />
                </div>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
            <ShieldCheck size={14} />
            <span>DPDP Act 2023 Compliant · GIGW 3.0 · WCAG 2.1 AA</span>
          </div>
        </div>
      </aside>

      {/* ──────────── RIGHT PANEL — Login / Register Form ──────────── */}
      <section className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 relative">
        <div className="absolute inset-0 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.05)] rounded-l-[3rem] z-0 hidden md:block" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          {/* Mobile-only heading */}
          <div className="mb-8 text-center md:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teams-ocean to-teams-iris shadow-lg">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-teams-dark">CSIR-SERC Recruitment</h1>
            <p className="mt-2 text-sm text-foreground-500">Transparent, Rule-Based Recruitment</p>
          </div>

          <Card className="border border-teams-border/40 shadow-xl bg-white/80 backdrop-blur-xl">
            <CardContent className="p-8">
              <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={(k) => setActiveTab(k.toString())}
                aria-label="Authentication Options"
                variant="primary"
                classNames={{
                  tabList: "w-full bg-teams-gray p-1 rounded-xl",
                  cursor: "bg-white shadow-sm rounded-lg",
                  tab: "h-10",
                  tabContent: "group-data-[selected=true]:text-teams-dark font-semibold text-foreground-500"
                }}
              >
                <Tab 
                  key="login" 
                  title={<div className="flex items-center gap-2"><LogIn size={16}/><span>Login</span></div>}
                >
                  <form action={async (formData) => { await applicantLogin(formData); }} className="mt-6 flex flex-col gap-5">
                    <div>
                      <h2 className="text-2xl font-bold text-teams-dark">Welcome back</h2>
                      <p className="mt-1 text-sm text-foreground-500">Sign in with your phone number or Aadhaar identifier</p>
                    </div>

                    <Input
                      name="identifier"
                      label="Phone Number / Aadhaar ID"
                      placeholder="Enter mobile or local Aadhaar ID"
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={<Phone size={16} className="text-foreground-400" />}
                      classNames={{
                        label: "text-foreground-700 font-semibold text-xs",
                        inputWrapper: "bg-white focus-within:border-teams-ocean shadow-sm border-teams-border/60"
                      }}
                    />

                    <div>
                      <Input
                        name="otp"
                        label="One-Time Password"
                        placeholder="● ● ● ● ● ●"
                        isRequired
                        maxLength={6}
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={<KeyRound size={16} className="text-foreground-400" />}
                        classNames={{
                          label: "text-foreground-700 font-semibold text-xs",
                          inputWrapper: "bg-white focus-within:border-teams-ocean shadow-sm border-teams-border/60",
                          input: "tracking-[0.3em] font-mono text-center"
                        }}
                      />
                      <p className="text-xs text-foreground-500 mt-2 flex items-center gap-1">
                        <KeyRound size={12} />
                        Demo OTP: <strong className="text-teams-ocean">123456</strong>
                      </p>
                    </div>

                    <input type="hidden" alt="name" value="Applicant" />

                    <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md mt-2" icon={<LogIn size={18} />}>
                      Sign In
                    </Button>

                    <div className="relative py-4 flex items-center">
                      <div className="flex-grow border-t border-teams-border/60"></div>
                      <span className="flex-shrink-0 mx-4 text-xs font-semibold text-foreground-400 uppercase tracking-wider">or</span>
                      <div className="flex-grow border-t border-teams-border/60"></div>
                    </div>

                    <Button 
                       
                      href="/applicant/dashboard" 
                      variant="ghost" 
                      className="w-full font-semibold bg-teams-gray hover:bg-teams-border/30 text-teams-dark"
                      icon={<Search size={18} />}
                    >
                      Check Application Status
                    </Button>
                  </form>
                </Tab>

                <Tab 
                  key="register" 
                  title={<div className="flex items-center gap-2"><UserPlus size={16}/><span>Register</span></div>}
                >
                  <form action={async (formData) => { await applicantLogin(formData); }} className="mt-6 flex flex-col gap-5">
                    <div>
                      <h2 className="text-2xl font-bold text-teams-dark">Create Account</h2>
                      <p className="mt-1 text-sm text-foreground-500">Register to start your application process</p>
                    </div>

                    <Input
                      name="name"
                      label="Full Name"
                      placeholder="Enter your full name"
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-foreground-700 font-semibold text-xs",
                        inputWrapper: "bg-white shadow-sm border-teams-border/60"
                      }}
                    />

                    <Input
                      name="identifier"
                      label="Mobile Number"
                      placeholder="10-digit mobile number"
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={<Phone size={16} className="text-foreground-400" />}
                      classNames={{
                        label: "text-foreground-700 font-semibold text-xs",
                        inputWrapper: "bg-white shadow-sm border-teams-border/60"
                      }}
                    />

                    <Input
                      name="email"
                      type="email"
                      label="Email Address (optional)"
                      placeholder="your.email@example.com"
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-foreground-700 font-semibold text-xs",
                        inputWrapper: "bg-white shadow-sm border-teams-border/60"
                      }}
                    />

                    <Select
                      name="category"
                      label="Category"
                      placeholder="Select Category"
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{
                        label: "text-foreground-700 font-semibold text-xs",
                        trigger: "bg-white shadow-sm border-teams-border/60"
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <SelectItem id={cat.value} key={cat.value} textValue={cat.label}>{cat.label}</SelectItem>
                      ))}
                    </Select>

                    <div>
                      <Input
                        name="otp"
                        label="Verification OTP"
                        placeholder="● ● ● ● ● ●"
                        isRequired
                        maxLength={6}
                        variant="bordered"
                        labelPlacement="outside"
                        startContent={<KeyRound size={16} className="text-foreground-400" />}
                        classNames={{
                          label: "text-foreground-700 font-semibold text-xs",
                          inputWrapper: "bg-white shadow-sm border-teams-border/60",
                          input: "tracking-[0.3em] font-mono text-center"
                        }}
                      />
                      <p className="text-xs text-foreground-500 mt-2 flex items-center gap-1">
                        <KeyRound size={12} />
                        Demo OTP: <strong className="text-teams-ocean">123456</strong>
                      </p>
                    </div>

                    <div className="bg-success/5 border border-success/20 rounded-xl p-4 mt-2">
                      <Checkbox 
                        alt="dpdp_consent" 
                        isRequired 
                        
                        classNames={{ label: "text-xs text-foreground-600 leading-relaxed" }}
                      >
                        I consent to the collection and processing of my personal
                        data as per the <strong className="text-success-600">Digital Personal Data Protection Act, 2023</strong>. 
                        My data will only be used for recruitment purposes.
                      </Checkbox>
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full font-bold shadow-md mt-2 text-white" icon={<UserPlus size={18} />}>
                      Create Account
                    </Button>
                  </form>
                </Tab>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 text-center text-xs font-medium text-foreground-400">
            <p>No live Aadhaar integration. Local identifier only.</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Link href="/admin/login" className="text-teams-ocean hover:text-teams-ocean/80 transition-colors">
                Admin Portal →
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

