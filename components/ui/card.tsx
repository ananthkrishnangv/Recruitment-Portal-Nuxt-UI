import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Card as HeroCard, CardContent } from "@/components/ui/heroui";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "elevated" | "outline";
  padding?: "sm" | "md" | "lg" | "none";
};

const variantClasses = {
  glass: "glass-panel",
  solid: "bg-white shadow-sm border border-teams-border/40",
  elevated: "bg-white shadow-md border border-teams-border/30",
  outline: "bg-transparent border border-teams-border",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function Card({ children, className, variant = "glass", padding = "md" }: CardProps) {
  return (
    <HeroCard className={cn(variantClasses[variant], className)}  >
      <CardContent className={paddingClasses[padding]}>
        {children}
      </CardContent>
    </HeroCard>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconBg?: string;
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  className,
  iconBg = "bg-teams-ocean/10 text-teams-ocean",
}: StatCardProps) {
  return (
    <Card variant="glass" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-foreground-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-teams-dark">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-semibold",
                trendUp ? "text-success" : "text-danger"
              )}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
