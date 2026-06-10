import { Chip } from "@/components/ui/heroui";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple" | "custom";

const statusVariantMap: Record<string, BadgeVariant> = {
  DRAFT: "default",
  SUBMITTED: "info",
  PAYMENT_PENDING: "warning",
  PAYMENT_SUCCESS: "success",
  UNDER_SCRUTINY: "warning",
  DEFICIENCY_RAISED: "danger",
  RECOMMENDED: "success",
  REJECTED: "danger",
  DIRECTOR_APPROVED: "success",
  LOCKED: "default",
  Success: "success",
  Pending: "warning",
  Failed: "danger",
};

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
};

export function Badge({ children, variant = "default", className, dot }: Props) {
  let color: any = "default";
  switch (variant) {
    case "success": color = "success"; break;
    case "warning": color = "warning"; break;
    case "danger": color = "danger"; break;
    case "info": color = "primary"; break;
    case "purple": color = "secondary"; break;
    case "default": color = "default"; break;
  }

  return (
    <Chip
      color={color}
      variant="flat"
      size="sm"
      className={className}
      classNames={{
        base: "border-small border-white/50 shadow-sm",
        content: "font-semibold text-xs tracking-wide",
      }}
      startContent={dot ? (
        <span className="mx-1 block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      ) : undefined}
    >
      {children}
    </Chip>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = statusVariantMap[status] || "default";
  return (
    <Badge variant={variant} dot className={className}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
