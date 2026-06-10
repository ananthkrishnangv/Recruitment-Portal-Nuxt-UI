"use client";
import { Button as HeroButton } from "@/components/ui/heroui";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "success" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  value?: string;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  href,
  children,
  disabled,
  value,
  ...props
}: Props) {
  let uiVariant: any = "solid";
  let uiColor: any = "default";

  switch (variant) {
    case "primary": uiVariant = "solid"; uiColor = "primary"; break;
    case "outline": uiVariant = "bordered"; uiColor = "default"; break;
    case "ghost": uiVariant = "light"; uiColor = "default"; break;
    case "danger": uiVariant = "solid"; uiColor = "danger"; break;
    case "success": uiVariant = "solid"; uiColor = "success"; break;
    case "secondary": uiVariant = "flat"; uiColor = "secondary"; break;
  }

  const content = (
    <>
      {loading && <span className="mr-2 animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  const commonProps = {
    variant: uiVariant,
    color: uiColor,
    size,
    isDisabled: disabled || loading,
    className: cn("font-medium", className),
    value: typeof value === 'string' ? value : undefined,
    ...props
  };

  if (href) {
    return (
      <HeroButton as={Link} href={href} {...(commonProps as any)}>
        {content}
      </HeroButton>
    );
  }

  return (
    <HeroButton {...(commonProps as any)}>
      {content}
    </HeroButton>
  );
}
