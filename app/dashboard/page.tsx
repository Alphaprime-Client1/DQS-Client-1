"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import useSWR from "swr";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { QRCard } from "@/components/dashboard/QRCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchQRCodes();
  }, [status]);

  const fetchQRCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/qr/list");
      if (res.ok) {
        const data = await res.json();
        setQrCodes(data.qrCodes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data: userData } = useSWR(session?.user ? "/api/user/me" : null, fetcher);

  const plan = (session?.user as any)?.plan ?? "free";
  const totalScans = qrCodes.reduce((acc, qr) => acc + (qr.scanCount || 0), 0);
  const totalComments = qrCodes.reduce((acc, qr) => acc + (qr.commentCount || 0), 0);
  const activeQRs = qrCodes.filter((qr) => qr.isActive).length;
  
  const storageUsage = userData?.storageUsage || 0;
  const storageLimit = userData?.storageLimit || 100;
  const atLimit = storageUsage >= storageLimit;

  const handleDelete = (id: string) => {
    setQrCodes((prev) => prev.filter((q) => q._id !== id));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-10 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">My QR Codes</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground text-sm">
                  Welcome, {session?.user?.name?.split(" ")[0]}
                </p>
                <PlanBadge plan={plan} />
              </div>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Link href={atLimit ? "#" : "/create"}>
                    <Button
                      className={`gap-2 ${!atLimit ? "gradient-primary text-white border-0" : "opacity-60 cursor-not-allowed"}`}
                      disabled={atLimit}
                    >
                      <Plus className="w-4 h-4" />
                      Create New QR
                    </Button>
                  </Link>
                </span>
              </TooltipTrigger>
              {atLimit && (
                <TooltipContent side="bottom" className="max-w-[200px] text-center">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Database storage limit reached. Remove some items or upgrade to Pro for more space.</span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Upgrade banner */}
        {atLimit && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-600">Database Storage Limit Reached</p>
              <p className="text-muted-foreground mt-0.5">
                You&apos;ve reached your database storage limit for the free plan. Usage is calculated based on QR codes, comments, and links. Upgrade to Pro for significantly more space and features.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <StatsRow total={qrCodes.length} totalScans={totalScans} active={activeQRs} totalComments={totalComments} />
        </div>

        {/* QR Codes Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : qrCodes.length === 0 ? (
          <EmptyState
            title="No QR codes yet"
            description="Create your first dynamic QR code and start tracking scans instantly."
            actionLabel="Create your first QR"
            actionHref="/create"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {qrCodes.map((qr) => (
              <QRCard key={qr._id} qr={qr} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
