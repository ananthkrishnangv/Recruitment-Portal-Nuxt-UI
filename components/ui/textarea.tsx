import { TextArea as HeroTextarea } from "@/components/ui/heroui";
import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
};

export function TextArea({
  label,
  error,
  helper,
  required,
  className,
  id,
  ...props
}: Props) {
  const textareaId = id || props.name;

  return (
    <HeroTextarea
      id={textareaId}
      label={label}
      isRequired={required}
      isInvalid={!!error}
      errorMessage={error}
      description={helper}
      variant="bordered"
      labelPlacement="outside"
      minRows={3}
      classNames={{
        base: className,
        label: "text-foreground-700 font-semibold text-xs pb-1",
        inputWrapper: "bg-white/60 hover:bg-white focus-within:bg-white shadow-sm transition-colors border-teams-border/60",
      }}
      {...(props as any)}
    />
  );
}
