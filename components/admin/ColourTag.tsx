import { cn } from "@/lib/utils";

const colourMap: Record<string, string> = {
  // Application Status
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-800",
  PAYMENT_PENDING: "bg-orange-100 text-orange-800",
  PAYMENT_SUCCESS: "bg-emerald-100 text-emerald-800",
  UNDER_SCRUTINY: "bg-amber-100 text-amber-800",
  RETURNED_FOR_CLARIFICATION: "bg-orange-100 text-orange-800",
  DEFICIENCY_RAISED: "bg-red-100 text-red-800",
  RECOMMENDED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  DIRECTOR_APPROVED: "bg-emerald-100 text-emerald-800",
  LOCKED: "bg-slate-100 text-slate-700",

  // Payment
  Success: "bg-emerald-100 text-emerald-800",
  Pending: "bg-orange-100 text-orange-800",
  Failed: "bg-red-100 text-red-800",

  // Reservation Category
  UR: "bg-slate-100 text-slate-700",
  OBC: "bg-indigo-100 text-indigo-800",
  SC: "bg-purple-100 text-purple-800",
  ST: "bg-purple-100 text-purple-800",
  EWS: "bg-teal-100 text-teal-800",
  PwBD: "bg-rose-100 text-rose-800",

  // Severity
  LOW: "bg-blue-100 text-blue-700",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",

  // CERT-In
  DETECTED: "bg-amber-100 text-amber-800",
  REPORTED_TO_CERT_IN: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-orange-100 text-orange-800",
  IMPLEMENTED: "bg-emerald-100 text-emerald-800",
  IMPLEMENTED_DEMO: "bg-sky-100 text-sky-800",
  NEEDS_REMEDIATION: "bg-red-100 text-red-800",
};

export function ColourTag({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const colours = colourMap[value] ?? "bg-slate-100 text-slate-700";
  return (
    <span
      className={cn(
        "badge",
        colours,
        className
      )}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}
