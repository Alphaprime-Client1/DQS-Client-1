"use client";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Get started by creating something new.",
  actionLabel,
  actionHref,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-24 text-center gap-4 animate-fade-in",
        className
      )}
    >
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-2 glow animate-float">
        {icon ?? <QrCode className="w-10 h-10 text-white" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="gradient-primary text-white border-0 mt-2" size="lg">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
