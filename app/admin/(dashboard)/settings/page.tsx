import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { saveSetting } from "@/app/actions/settings";
import Link from "next/link";
import { Input, Card, CardContent, Checkbox, CardHeader } from "@/components/ui/heroui";
import {
  Settings,
  Mail,
  MessageSquare,
  Send,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Settings",
};

const settingGroups = [
  {
    title: "Site Settings",
    description: "Portal name, helpdesk, branding and public notices",
    icon: Globe,
    href: null,
    keys: [
      "portal.title",
      "portal.helpdeskEmail",
      "portal.helpdeskPhone",
      "portal.maintenanceMode",
      "portal.publicNotice",
    ],
  },
  {
    title: "SMTP Email",
    description: "Transactional email configuration for OTP and notifications",
    icon: Mail,
    href: "/admin/settings/smtp",
    keys: [],
  },
  {
    title: "Telegram Notifications",
    description: "Bot token and channel configuration for admin alerts",
    icon: Send,
    href: "/admin/settings/telegram",
    keys: [],
  },
  {
    title: "WhatsApp (Optional)",
    description: "Optional provider integration for applicant notifications",
    icon: MessageSquare,
    href: "/admin/settings/whatsapp",
    keys: [],
  },
  {
    title: "Security Settings",
    description: "OTP expiry, session timeout, upload limits, and rate limiting",
    icon: Shield,
    href: null,
    keys: [
      "security.otpExpiryMinutes",
      "security.maxUploadMb",
      "security.sessionTimeoutMinutes",
      "security.maxLoginAttempts",
    ],
  },
];

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  const settingMap = new Map(rows.map((r) => [r.key, r]));

  // Collect all inline keys
  const inlineGroups = settingGroups.filter((g) => !g.href && g.keys.length > 0);
  const linkGroups = settingGroups.filter((g) => g.href);

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <Card  className="border border-teams-border/40">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teams-ocean/10">
              <Settings size={24} className="text-teams-ocean" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teams-dark">
                Advanced Settings
              </h1>
              <p className="mt-1 text-sm text-foreground-500">
                Manage site, notifications, security and compliance settings. All changes are audit logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards for sub-pages */}
      <div className="grid gap-4 md:grid-cols-2">
        {linkGroups.map((group) => (
          <Card key={group.title} as={Link} href={group.href!}  className="border border-teams-border/40 hover:bg-teams-gray/20 transition-colors">
            <CardContent className="p-5 flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teams-gray">
                <group.icon size={20} className="text-teams-dark" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-teams-dark">
                  {group.title}
                </h2>
                <p className="text-sm text-foreground-500">
                  {group.description}
                </p>
              </div>
              <ChevronRight size={20} className="text-foreground-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inline Setting Groups */}
      {inlineGroups.map((group) => (
        <Card key={group.title}  className="border border-teams-border/40">
          <CardHeader className="border-b border-teams-border/40 bg-teams-gray/30 px-6 py-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-teams-border/40">
              <group.icon size={18} className="text-teams-dark" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-teams-dark">
                {group.title}
              </h2>
              <p className="text-sm text-foreground-500">{group.description}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {group.keys.map((key) => {
                const setting = settingMap.get(key);
                const currentValue = setting
                  ? typeof setting.value === "string"
                    ? setting.value
                    : JSON.stringify(setting.value)
                  : "";

                return (
                  <form key={key} action={saveSetting} className="rounded-2xl border border-teams-border/40 bg-teams-gray/10 p-5">
                    <input type="hidden" alt="key" value={key} />
                    
                    <Input
                      alt="value"
                      label={key}
                      defaultValue={setting?.isSecret ? "" : currentValue}
                      placeholder={setting?.isSecret ? "••••••••" : "Enter value"}
                      variant="bordered"
                      labelPlacement="outside"
                      isRequired
                      classNames={{
                        label: "text-foreground-700 font-bold text-xs tracking-widest uppercase mb-2",
                        inputWrapper: "bg-white shadow-sm border-teams-border/60"
                      }}
                    />
                    
                    <div className="mt-6 flex items-center justify-between border-t border-teams-border/30 pt-4">
                      <Checkbox 
                        alt="isSecret"
                        defaultSelected={setting?.isSecret ?? false}
                        size="sm"
                        classNames={{ label: "text-xs font-semibold text-foreground-500" }}
                      >
                        Sensitive / Masked
                      </Checkbox>
                      <Button type="submit" variant="primary" size="sm" className="font-bold bg-teams-ocean text-white shadow-sm px-6">
                        Save
                      </Button>
                    </div>
                  </form>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
