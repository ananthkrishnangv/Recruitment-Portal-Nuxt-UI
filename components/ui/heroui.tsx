"use client";

export * from "@heroui/react";

import { 
  Select as HeroSelect, 
  SelectTrigger, 
  SelectValue, 
  SelectPopover, 
  ListBox, 
  ListBoxItem,
  SelectIndicator,
  Tabs as HeroTabs,
  TabList,
  Tab as HeroTab,
  TabPanel
} from "@heroui/react";
import React from "react";
import { Label, FieldError, Text } from "react-aria-components";

// Polyfill for Shadcn CardContent, CardHeader, CardFooter
export function CardContent({ className, children, ...props }: any) {
  return <div className={`p-4 ${className || ""}`} {...props}>{children}</div>;
}
export function CardHeader({ className, children, ...props }: any) {
  return <div className={`p-4 pb-0 font-bold ${className || ""}`} {...props}>{children}</div>;
}
export function CardFooter({ className, children, ...props }: any) {
  return <div className={`p-4 pt-0 ${className || ""}`} {...props}>{children}</div>;
}

// Polyfill for NextUI v2 SelectItem
export const SelectItem = ListBoxItem;

// Polyfill for NextUI v2 Select
export function Select({
  label,
  placeholder,
  children,
  isRequired,
  isInvalid,
  errorMessage,
  description,
  className,
  classNames,
  labelPlacement = "outside",
  onChange,
  name,
  id,
  selectedKeys,
  ...props
}: any) {
  return (
    <HeroSelect 
      isRequired={isRequired} 
      isInvalid={isInvalid} 
      className={className || classNames?.base} 
      name={name}
      id={id}
      selectedKeys={selectedKeys}
      onSelectionChange={(keys: any) => {
        if (onChange) {
          const val = Array.from(keys).join(",");
          onChange({ target: { value: val, name } });
        }
      }}
      {...props}
    >
      <div className="flex flex-col gap-1 w-full relative">
        {label && (
          <Label className={`text-sm font-medium ${isInvalid ? "text-danger" : "text-foreground-700"} ${classNames?.label || ""}`}>
            {label} {isRequired && <span className="text-danger">*</span>}
          </Label>
        )}
        <SelectTrigger className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm transition-colors ${isInvalid ? "border-danger text-danger bg-danger-50" : "border-teams-border/60 bg-white hover:bg-white/90"} ${classNames?.trigger || ""}`}>
          <SelectValue className={`text-sm ${classNames?.value || ""}`} />
          <SelectIndicator className={classNames?.indicator} />
        </SelectTrigger>
        {description && <Text slot="description" className="text-xs text-foreground-500 mt-1">{description}</Text>}
        {errorMessage && <FieldError className="text-xs text-danger mt-1">{errorMessage}</FieldError>}
        <SelectPopover className={`w-full ${classNames?.popover || ""}`}>
          <ListBox className={`p-1 ${classNames?.listbox || ""}`}>
            {children}
          </ListBox>
        </SelectPopover>
      </div>
    </HeroSelect>
  );
}

// Polyfill for NextUI v2 Tabs
export function Tabs({ children, ...props }: any) {
  const tabs = React.Children.toArray(children).map((child: any) => ({
    key: child.props?.key || child.key || Math.random().toString(),
    title: child.props?.title || child.props?.name,
    content: child.props?.children
  }));

  return (
    <HeroTabs {...props}>
      <TabList>
        {tabs.map((tab) => (
          <HeroTab id={tab.key} key={tab.key}>{tab.title}</HeroTab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel id={tab.key} key={`panel-${tab.key}`}>
          {tab.content}
        </TabPanel>
      ))}
    </HeroTabs>
  );
}

// Polyfill for NextUI v2 Tab
export function Tab() {
  return null;
}
