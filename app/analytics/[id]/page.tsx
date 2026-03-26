"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ScanChart } from "@/components/analytics/ScanChart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Eye,
  Crown,
  MessageSquare,
  Monitor,
  Calendar,
  TrendingUp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { PlanBadge } from "@/components/shared/PlanBadge";

interface AnalyticsData {
  scanCount: number;
  commentCount: number;
  logs: { timestamp: string; userAgent?: string; country?: string }[];
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrName, setQrName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!id || status !== "authenticated") return;
    fetchAnalytics();
  }, [id, status]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsRes, qrRes] = await Promise.all([
        fetch(`/api/analytics/${id}`),
        fetch(`/api/qr/${id}/details`),
      ]);

      if (!analyticsRes.ok) {
        toast({ title: "Access denied or QR not found", variant: "destructive" });
        router.push("/dashboard");
        return;
      }

      const analyticsData = await analyticsRes.json();
      setData(analyticsData);

      if (qrRes.ok) {
        const qrData = await qrRes.json();
        setQrName(qrData.name);
      }
    } catch {
      toast({ title: "Failed to load analytics", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const plan = (session?.user as any)?.plan ?? "free";
  const isPro = plan === "pro";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10 max-w-5xl space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">Analytics</h1>
              {qrName && (
                <Badge variant="secondary" className="text-sm font-normal">{qrName}</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Scan / Click statistics for your QR code
            </p>
          </div>
          <PlanBadge plan={plan} />
        </div>

        {/* Big stat cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="p-8 border border-border/50 text-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative z-10">
              <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">Total Scans / Clicks</p>
              <p className="text-7xl font-extrabold gradient-text">{data?.scanCount ?? 0}</p>
              <p className="text-muted-foreground text-sm mt-2">
                All-time scans and clicks for this QR code
              </p>
            </div>
          </Card>
          <Card className="p-8 border border-border/50 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-violet-500 opacity-5" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-violet-400" />
                <p className="text-muted-foreground text-sm uppercase tracking-wider">Total Comments</p>
              </div>
              <p className="text-7xl font-extrabold text-violet-400">{data?.commentCount ?? 0}</p>
              <p className="text-muted-foreground text-sm mt-2">
                All-time comments on this QR code
              </p>
            </div>
          </Card>
        </div>

        {/* Chart */}
        {isPro ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 border border-border/50">
                <h2 className="font-semibold mb-1">Scans / Clicks — Last 7 Days</h2>
                <p className="text-muted-foreground text-sm mb-6">Daily activity</p>
                {data?.logs && data.logs.length > 0 ? (
                  <ScanChart logs={data.logs} />
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                    No scans / clicks recorded yet
                  </div>
                )}
              </Card>
            </div>

            {/* Quick stats */}
            <div className="space-y-4">
              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm font-medium">Last 7 Days</p>
                </div>
                <p className="text-3xl font-bold">{data?.logs?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">interactions in past week</p>
              </Card>
              <Card className="p-5 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-sm font-medium">Latest Interaction</p>
                </div>
                <p className="text-sm font-semibold">
                  {data?.logs?.[0]
                    ? new Date(data.logs[0].timestamp).toLocaleDateString()
                    : "No interactions yet"}
                </p>
              </Card>
            </div>
          </div>
        ) : (
          /* Free plan — upgrade prompt */
          <Card className="p-8 border border-primary/20 bg-primary/5 text-center">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Detailed Analytics</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Upgrade to Pro to unlock detailed interaction logs, device info, daily charts, and country tracking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="gradient-primary text-white border-0 gap-2">
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Scan log table — Pro only */}
        {isPro && data?.logs && data.logs.length > 0 && (
          <Card className="mt-6 border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold">History</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Last 7 days of activity</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Device / Browser</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.logs.slice(0, 50).map((log, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Monitor className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[250px]">{log.userAgent || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {log.country || "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
