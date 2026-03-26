"use client";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: "free" | "pro";
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  if (plan === "pro") {
    return (
      <Badge
        className={cn(
          "gradient-primary text-white border-0 gap-1 font-semibold",
          className
        )}
      >
        <Crown className="w-3 h-3" />
        Pro
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={cn("gap-1 font-medium", className)}>
      <Zap className="w-3 h-3" />
      Free
    </Badge>
  );
}
