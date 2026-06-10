import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center animate-fade-in-up", className)}>
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teams-ocean/10 text-teams-ocean shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-teams-dark">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-foreground-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
