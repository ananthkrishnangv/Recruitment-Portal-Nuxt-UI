"use client";

import Link from "next/link";
import { applicantLogin } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Phone,
  KeyRound,
  UserPlus,
  ShieldCheck,
  FileText,
  CreditCard,
  Activity,
  CalendarDays,
  Users,
  ArrowLeft,
} from "lucide-react";

const FEATURES = [
  { icon: FileText, label: "Online Application & Document Vault" },
  { icon: ShieldCheck, label: "Secure Document Management" },
  { icon: CreditCard, label: "Payment Tracking & Receipts" },
  { icon: Activity, label: "Real-Time Status Updates" },
];

const CATEGORIES = [
  { value: "", label: "Select Category" },
  { value: "UR", label: "UR — Unreserved" },
  { value: "OBC", label: "OBC — Other Backward Class" },
  { value: "SC", label: "SC — Scheduled Caste" },
  { value: "ST", label: "ST — Scheduled Tribe" },
  { value: "EWS", label: "EWS — Economically Weaker" },
  { value: "PwBD", label: "PwBD — Persons with Disability" },
];

const GENDERS = [
  { value: "", label: "Select Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* ──────────── LEFT PANEL — Gradient Hero ──────────── */}
      <aside className="relative hidden md:flex flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-emerald-700 px-10 lg:px-16">
        {/* Decorative floating glass panels */}
        <div className="absolute -top-10 -left-10 h-60 w-60 rounded-3xl bg-white/[0.06] rotate-12 backdrop-blur-sm border border-white/10" />
        <div className="absolute top-1/4 right-8 h-36 w-48 rounded-2xl bg-white/[0.08] -rotate-6 backdrop-blur-sm border border-white/10" />
        <div className="absolute bottom-20 left-12 h-28 w-40 rounded-2xl bg-white/[0.05] rotate-3 backdrop-blur-sm border border-white/10" />
        <div className="absolute bottom-1/3 right-16 h-20 w-20 rounded-xl bg-emerald-400/10 rotate-45 backdrop-blur-sm border border-white/10" />
        <div className="absolute top-16 right-1/3 h-16 w-32 rounded-xl bg-cyan-400/10 -rotate-12 backdrop-blur-sm border border-white/10" />

        {/* Content */}
        <div className="relative z-10 animate-fade-in">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm border border-white/10">
            <ShieldCheck size={16} />
            Government of India
          </div>

          {/* Heading */}
          <h1 className="heading-font text-4xl font-bold text-white lg:text-5xl leading-tight">
            CSIR-SERC
            <span className="block text-emerald-300">Recruitment Portal</span>
          </h1>

          {/* Tagline */}
          <p className="mt-4 max-w-md text-lg leading-relaxed text-blue-100/80">
            Transparent, Rule-Based Recruitment for Scientific &amp;
            Technical Positions
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4 stagger-children">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-white/90"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <Icon size={18} className="text-emerald-300" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 flex items-center gap-2 text-xs text-blue-200/60">
            <ShieldCheck size={14} />
            <span>
              DPDP Act 2023 Compliant · GIGW 3.0 · WCAG 2.1 AA
            </span>
          </div>
        </div>
      </aside>

      {/* ──────────── RIGHT PANEL — Registration Form ──────────── */}
      <section className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50/40 px-4 py-10 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Back to Login */}
          <Link
            href="/auth/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>

          {/* Header Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-blue-700 shadow-lg shadow-emerald-900/20">
            <UserPlus size={32} className="text-white" />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="heading-font text-2xl font-bold text-blue-950">
              Create Your Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details to start the application process
            </p>
          </div>

          {/* Registration Form */}
          <form
            action={async (formData) => { await applicantLogin(formData); }}
            className="space-y-5"
          >
            {/* Full Name */}
            <div>
              <label className="label label-required" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                alt="name"
                required
                className="input"
                placeholder="Enter your full name (as on documents)"
                autoComplete="name"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="label label-required" htmlFor="reg-mobile">
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="reg-mobile"
                  alt="identifier"
                  required
                  className="input pl-10"
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Email (optional) */}
            <div>
              <label className="label" htmlFor="reg-email">
                Email Address
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (optional)
                </span>
              </label>
              <input
                id="reg-email"
                alt="email"
                type="email"
                className="input"
                placeholder="your.email@example.com"
                autoComplete="email"
              />
            </div>

            {/* Two-column row: DOB + Gender */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Date of Birth */}
              <div>
                <label className="label label-required" htmlFor="reg-dob">
                  Date of Birth
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="reg-dob"
                    alt="dob"
                    type="date"
                    required
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="label label-required" htmlFor="reg-gender">
                  Gender
                </label>
                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <select
                    id="reg-gender"
                    name="gender"
                    required
                    className="input pl-10"
                    defaultValue=""
                  >
                    {GENDERS.map((g) => (
                      <option
                        key={g.value}
                        value={g.value}
                        disabled={g.value === ""}
                      >
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label label-required" htmlFor="reg-category">
                Category
              </label>
              <select
                id="reg-category"
                name="category"
                required
                className="input"
                defaultValue=""
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    disabled={cat.value === ""}
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* OTP */}
            <div>
              <label className="label label-required" htmlFor="reg-otp">
                Verification OTP
              </label>
              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="reg-otp"
                  alt="otp"
                  required
                  maxLength={6}
                  className="input pl-10 tracking-[0.3em] font-mono"
                  placeholder="● ● ● ● ● ●"
                  autoComplete="one-time-code"
                />
              </div>
              <p className="helper-text mt-1.5 flex items-center gap-1">
                <KeyRound size={12} />
                Demo OTP: <strong className="text-blue-700">123456</strong>
              </p>
            </div>

            {/* DPDP Consent Section */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <ShieldCheck size={16} />
                Data Protection Consent
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                Under the{" "}
                <strong className="text-emerald-700">
                  Digital Personal Data Protection Act, 2023
                </strong>
                , your personal data (name, mobile, date of birth, category, and
                uploaded documents) will be collected solely for recruitment
                processing at CSIR-SERC. Data is encrypted at rest, retained as
                per DoPT guidelines, and will not be shared with unauthorized
                third parties. You may request deletion of your data after the
                recruitment cycle concludes.
              </p>
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  alt="dpdp_consent"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  I have read and consent to the processing of my personal data
                  as described above.
                  <span className="text-red-500 ml-0.5">*</span>
                </span>
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              size="lg"
              variant="success"
              className="w-full"
              icon={<UserPlus size={18} />}
            >
              Create Account & Continue
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-400">
            <p>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
            <div className="mt-3 flex items-center justify-center gap-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Home
              </Link>
              <span className="text-slate-300">|</span>
              <Link
                href="/admin/login"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
