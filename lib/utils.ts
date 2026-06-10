import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function maskAadhaar(value?: string | null) { if (!value) return "Not provided"; return `XXXX-XXXX-${value.slice(-4)}`; }
export function formatDate(d?: Date | string | null) { if (!d) return "—"; return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d)); }
export function safeJson(value: unknown) { return JSON.parse(JSON.stringify(value)); }
