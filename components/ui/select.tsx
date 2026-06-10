"use client";

import { Select as HeroSelect, SelectItem as SelectItem } from "@/components/ui/heroui";
import type { SelectHTMLAttributes } from "react";

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({
  label,
  error,
  helper,
  required,
  options,
  placeholder,
  className,
  id,
  value,
  onChange,
  ...props
}: Props) {
  const selectId = id || props.name;

  return (
    <HeroSelect
      id={selectId}
      label={label}
      isRequired={required}
      isInvalid={!!error}
      errorMessage={error}
      description={helper}
      placeholder={placeholder}
      variant="bordered"
      labelPlacement="outside"
      selectedKeys={value ? [value.toString()] : []}
      onChange={onChange}
      classNames={{
        base: className,
        label: "text-foreground-700 font-semibold text-xs pb-1",
        trigger: "bg-white/60 hover:bg-white focus-within:bg-white shadow-sm transition-colors border-teams-border/60",
      }}
      {...(props as any)}
    >
      {options.map((opt) => (
        <SelectItem key={opt.value} id={opt.value} textValue={opt.label}>
          {opt.label}
        </SelectItem>
      ))}
    </HeroSelect>
  );
}
