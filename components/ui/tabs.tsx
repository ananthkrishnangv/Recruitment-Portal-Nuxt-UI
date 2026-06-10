"use client";

import { Tabs as HeroTabs, Tab, Badge } from "@/components/ui/heroui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { key: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
};

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={className}>
      <HeroTabs 
        selectedKey={activeTab} 
        onSelectionChange={(k) => onChange(k.toString())}
        className="bg-white/60 shadow-sm border border-teams-border/40"
      >
        {tabs.map((tab) => (
          <Tab key={tab.key} id={tab.key}>
            <div className="flex items-center space-x-2">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge 
                  content={String(tab.count)} 
                  color={activeTab === tab.key ? "default" : "secondary"}
                  className="border-none"
                  size="sm"
                >
                  <span className="w-1" />
                </Badge>
              )}
            </div>
          </Tab>
        ))}
      </HeroTabs>
    </div>
  );
}

type TabPanelProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
};

export function TabPanel({ active, children, className }: TabPanelProps) {
  if (!active) return null;
  return (
    <div role="tabpanel" className={cn("animate-fade-in pt-4", className)}>
      {children}
    </div>
  );
}
