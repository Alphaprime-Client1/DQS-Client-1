"use client";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProLockProps {
  className?: string;
  label?: string;
}

export function ProLock({ className, label = "Pro" }: ProLockProps) {
  return (
    <Badge
      className={cn(
        "gradient-primary text-white border-0 gap-1 text-xs font-semibold",
        className
      )}
    >
      <Lock className="w-3 h-3" />
      {label}
    </Badge>
  );
}
