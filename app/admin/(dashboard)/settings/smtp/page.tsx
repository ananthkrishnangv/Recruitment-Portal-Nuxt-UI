import { prisma } from "@/lib/db/prisma";
import { saveSetting } from "@/app/actions/settings";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";

export const metadata = {
  title: "SMTP Settings",
};

const smtpKeys = [
  {
    key: "notification.smtp.host",
    label: "SMTP Host",
    description: "Mail server hostname (e.g., smtp.gov.in)",
    secret: false,
  },
  {
    key: "notification.smtp.port",
    label: "SMTP Port",
    description: "Usually 587 (TLS) or 465 (SSL)",
    secret: false,
  },
  {
    key: "notification.smtp.user",
    label: "Username",
    description: "SMTP authentication username",
    secret: false,
  },
  {
    key: "notification.smtp.password",
    label: "Password",
    description: "SMTP authentication password",
    secret: true,
  },
  {
    key: "notification.smtp.fromEmail",
    label: "From Email",
    description: "Sender email address for outgoing mail",
    secret: false,
  },
  {
    key: "notification.smtp.replyTo",
    label: "Reply-To",
    description: "Reply-to email address",
    secret: false,
  },
  {
    key: "notification.smtp.tls",
    label: "TLS Enabled",
    description: "Enable TLS encryption (recommended)",
    secret: false,
  },
];

export default async function SmtpSettingsPage() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: smtpKeys.map((k) => k.key) } },
    orderBy: { key: "asc" },
  });
  const map = new Map(rows.map((r) => [r.key, r]));

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="glass-card p-6">
        <Link
          href="/admin/settings"
          className="mb-3 inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to Settings
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Mail size={20} className="text-blue-700" />
          </div>
          <div>
            <h1 className="heading-font text-3xl font-bold text-blue-950">
              SMTP Email Settings
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Configure official transactional email relay for OTP, application
              acknowledgement, deficiency notices and admin alerts.
            </p>
          </div>
        </div>
      </div>

      {/* SMTP Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {smtpKeys.map((config) => {
          const setting = map.get(config.key);
          const currentValue = setting
            ? typeof setting.value === "string"
              ? setting.value.replace(/^"|"$/g, "")
              : JSON.stringify(setting.value)
            : "";

          return (
            <form
              key={config.key}
              action={saveSetting}
              className="glass-card p-5"
            >
              <input type="hidden" alt="key" value={config.key} />
              <h2 className="heading-font text-lg font-bold text-blue-950">
                {config.label}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {config.description}
              </p>
              <input
                alt="value"
                className="input mt-3"
                type={config.secret ? "password" : "text"}
                defaultValue={config.secret ? "" : currentValue}
                placeholder={config.secret ? "••••••••" : "Enter value"}
              />
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    alt="isSecret"
                    defaultChecked={config.secret}
                    className="rounded"
                  />
                  Secret
                </label>
                <button className="rounded-xl bg-blue-700 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-800">
                  Save
                </button>
              </div>
            </form>
          );
        })}
      </div>

      {/* Test Email */}
      <div className="glass-card p-6">
        <h2 className="heading-font text-xl font-bold text-blue-950">
          Test Email
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Send a test email to verify SMTP configuration is working.
        </p>
        <div className="mt-4 flex gap-3">
          <input
            className="input max-w-sm"
            type="email"
            placeholder="test@example.gov.in"
            disabled
          />
          <button
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white opacity-60 cursor-not-allowed"
            disabled
            title="Configure SMTP settings first"
          >
            <Send size={14} className="inline mr-1" />
            Send Test
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Test email will be available after SMTP host and credentials are
          configured.
        </p>
      </div>
    </div>
  );
}
