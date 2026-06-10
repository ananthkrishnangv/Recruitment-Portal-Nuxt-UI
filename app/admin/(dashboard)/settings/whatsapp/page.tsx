import { prisma } from "@/lib/db/prisma";
import { saveSetting } from "@/app/actions/settings";
import Link from "next/link";
import { ArrowLeft, MessageSquare, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "WhatsApp Settings",
};

const keys = [
  {
    key: "notification.whatsapp.enabled",
    label: "Enable WhatsApp",
    description: "Toggle WhatsApp notifications (requires approved provider)",
    secret: false,
  },
  {
    key: "notification.whatsapp.provider",
    label: "Provider",
    description:
      "WhatsApp Business API provider name (e.g., Gupshup, Twilio, ValueFirst)",
    secret: false,
  },
  {
    key: "notification.whatsapp.apiEndpoint",
    label: "API Endpoint",
    description: "Provider API base URL",
    secret: true,
  },
  {
    key: "notification.whatsapp.apiToken",
    label: "API Token",
    description: "Authentication token for the provider API",
    secret: true,
  },
  {
    key: "notification.whatsapp.templateApplicationSubmitted",
    label: "Template: Application Submitted",
    description: "Template ID for application submission confirmation",
    secret: false,
  },
  {
    key: "notification.whatsapp.templateDeficiency",
    label: "Template: Deficiency Notice",
    description: "Template ID for deficiency notification to applicant",
    secret: false,
  },
  {
    key: "notification.whatsapp.consentRequired",
    label: "Consent Required",
    description:
      "Require explicit applicant opt-in for WhatsApp (true/false)",
    secret: false,
  },
];

export default async function WhatsAppSettingsPage() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: keys.map((k) => k.key) } },
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <MessageSquare size={20} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="heading-font text-3xl font-bold text-blue-950">
              WhatsApp Notification Settings
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Configure optional WhatsApp Business API provider for applicant
              notifications. Email/SMS fallback must remain available.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Warning */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
        <div className="flex gap-3">
          <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            <h3 className="font-bold text-amber-900">
              Compliance Requirements
            </h3>
            <ul className="mt-2 list-disc ml-4 space-y-1 text-sm text-amber-800">
              <li>
                WhatsApp notifications require explicit applicant consent (DPDP
                Act 2023)
              </li>
              <li>
                Only use government-approved WhatsApp Business API providers
              </li>
              <li>Email and SMS fallback must remain available at all times</li>
              <li>
                All notification events are audit-logged with consent
                verification
              </li>
              <li>
                Template messages must be pre-approved by the provider
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {keys.map((config) => {
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
                <button className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700">
                  Save
                </button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}
