import { Input as HeroInput } from "@/components/ui/heroui";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
};

export function Input({
  label,
  error,
  helper,
  required,
  className,
  id,
  type = "text",
  ...props
}: Props) {
  const inputId = id || props.name;

  return (
    <HeroInput
      id={inputId}
      type={type}
      label={label}
      isRequired={required}
      isInvalid={!!error}
      errorMessage={error}
      description={helper}
      variant="bordered"
      labelPlacement="outside"
      classNames={{
        base: className,
        label: "text-foreground-700 font-semibold text-xs pb-1",
        inputWrapper: "bg-white/60 hover:bg-white focus-within:bg-white shadow-sm transition-colors border-teams-border/60",
      }}
      {...(props as any)}
    />
  );
}
