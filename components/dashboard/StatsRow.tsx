"use client";
import { QrCode, Eye, Activity, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsRowProps {
  total: number;
  totalScans: number;
  active: number;
  totalComments: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number;
  icon: any;
  gradient: string;
}) => (
  <Card className="p-6 flex items-center gap-4 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", gradient)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
    </div>
  </Card>
);

export function StatsRow({ total, totalScans, active, totalComments }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Total QR Codes" value={total} icon={QrCode} gradient="gradient-primary" />
      <StatCard
        label="Total Scans / Clicks"
        value={totalScans}
        icon={Eye}
        gradient="bg-gradient-to-br from-sky-500 to-blue-600"
      />
      <StatCard
        label="Total Comments"
        value={totalComments}
        icon={MessageSquare}
        gradient="bg-gradient-to-br from-violet-500 to-purple-700"
      />
      <StatCard
        label="Active QRs"
        value={active}
        icon={Activity}
        gradient="bg-gradient-to-br from-emerald-500 to-green-600"
      />
    </div>
  );
}
