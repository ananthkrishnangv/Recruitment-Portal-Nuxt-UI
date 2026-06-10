"use client";

import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
};

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full m-4 h-[calc(100vh-2rem)]",
} as const;

export function Modal({ open, onClose, title, children, size = "md", className }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        "relative z-50 w-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up",
        sizeMap[size],
        className
      )}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-teams-border/40 bg-teams-gray/50">
            <h2 className="text-lg font-bold text-teams-dark">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-teams-border/50 transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Drawer({ open, onClose, title, children, className }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        "relative z-50 w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-fade-in",
        className
      )}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-teams-border/40 bg-teams-gray/50">
            <h2 className="text-lg font-bold text-teams-dark">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-teams-border/50 transition-colors">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
