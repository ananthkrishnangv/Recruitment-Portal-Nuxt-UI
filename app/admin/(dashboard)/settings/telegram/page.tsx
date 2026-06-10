import { prisma } from "@/lib/db/prisma";
import { saveSetting } from "@/app/actions/settings";
import Link from "next/link";
import { ArrowLeft, Send, Bot, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Telegram Settings",
};

const telegramKeys = [
  {
    key: "notification.telegram.enabled",
    label: "Enable Telegram Notifications",
    description: "Toggle Telegram bot notifications for admin alerts",
    secret: false,
  },
  {
    key: "notification.telegram.botToken",
    label: "Bot Token",
    description: "Telegram Bot API token from @BotFather",
    secret: true,
  },
  {
    key: "notification.telegram.chatId",
    label: "Chat / Channel ID",
    description: "Telegram chat or channel ID for receiving notifications",
    secret: false,
  },
  {
    key: "notification.telegram.templateApplicationReceived",
    label: "Template: Application Received",
    description: "Message template for new application notifications",
    secret: false,
  },
  {
    key: "notification.telegram.templateScrutinyAlert",
    label: "Template: Scrutiny Alert",
    description: "Message template for scrutiny status change alerts",
    secret: false,
  },
  {
    key: "notification.telegram.adminOnly",
    label: "Admin Only",
    description: "Restrict notifications to admin events only (true/false)",
    secret: false,
  },
];

export default async function TelegramSettingsPage() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: telegramKeys.map((k) => k.key) } },
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
            <Send size={20} className="text-blue-700" />
          </div>
          <div>
            <h1 className="heading-font text-3xl font-bold text-blue-950">
              Telegram Notification Settings
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Configure Telegram bot for admin alerts and notification delivery.
              Create a bot via{" "}
              <span className="font-semibold text-blue-700">@BotFather</span>{" "}
              on Telegram.
            </p>
          </div>
        </div>
      </div>

      {/* How to Setup */}
      <div className="glass-card p-5">
        <h2 className="heading-font text-lg font-bold text-blue-950 mb-3">
          <Bot size={18} className="inline mr-2 text-blue-600" />
          Setup Guide
        </h2>
        <ol className="ml-4 list-decimal space-y-2 text-sm text-slate-600">
          <li>
            Open Telegram and search for{" "}
            <span className="font-semibold text-blue-800">@BotFather</span>
          </li>
          <li>
            Send <code className="rounded bg-slate-100 px-1 text-xs">/newbot</code>{" "}
            and follow prompts to create a bot
          </li>
          <li>Copy the bot token and paste below</li>
          <li>
            Add the bot to your admin group/channel and get the chat ID using{" "}
            <code className="rounded bg-slate-100 px-1 text-xs">
              /getUpdates
            </code>
          </li>
          <li>Enable notifications and save settings</li>
        </ol>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {telegramKeys.map((config) => {
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

      {/* Test Message */}
      <div className="glass-card p-6">
        <h2 className="heading-font text-xl font-bold text-blue-950">
          <MessageCircle size={18} className="inline mr-2 text-emerald-600" />
          Send Test Message
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Send a test message to verify Telegram bot configuration.
        </p>
        <div className="mt-4 flex gap-3">
          <input
            className="input max-w-sm"
            placeholder="Test message content..."
            disabled
          />
          <button
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white opacity-60 cursor-not-allowed"
            disabled
            title="Configure bot token and chat ID first"
          >
            <Send size={14} className="inline mr-1" />
            Send Test
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Available after bot token and chat ID are configured.
        </p>
      </div>
    </div>
  );
}
