"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { QrCode, LayoutDashboard, Plus, LogOut, User, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlanBadge } from "@/components/shared/PlanBadge";

export function Navbar() {
  const { data: session } = useSession();
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data: userData, mutate } = useSWR(session?.user ? "/api/user/me" : null, fetcher);

    const storageUsage = userData?.storageUsage || 0;
    const storageLimit = userData?.storageLimit || 100;
    const usagePercent = Math.min(100, Math.round((storageUsage / storageLimit) * 100));
    const freePercent = 100 - usagePercent;

    return (
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="DQCR Homepage">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">DQCR</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/create">
                  <Button size="sm" className="gradient-primary text-white border-0 gap-1.5">
                    <Plus className="w-4 h-4" />
                    Create QR
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/login">
                  <Button size="sm" className="gradient-primary text-white border-0">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary px-2 py-1 hover:bg-muted transition-colors" aria-label="Open User Menu">
                  <span className="text-sm font-medium hidden sm:inline-block text-foreground">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                    <AvatarFallback className="gradient-primary text-white text-xs font-bold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  <div className="mt-1">
                    <PlanBadge plan={(session.user as any).plan ?? "free"} />
                  </div>
                  {userData && (
                    <div className="mt-4 mb-2">
                      <div className="flex justify-between items-center text-[10px] mb-1.5 font-medium">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Database className="w-3 h-3" /> Database Space
                        </span>
                        <span className={usagePercent > 80 ? "text-destructive" : "text-primary"}>
                          {usagePercent}% Used
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${usagePercent >= 100 ? 'bg-destructive' : 'gradient-primary'}`} 
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
                        <span>{usagePercent}% Used</span>
                        <span>{freePercent}% Free</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground mt-2 italic">
                        Usage calculated by QRs, links & comments
                      </p>
                    </div>
                  )}
                </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete ALL your QR codes? This will erase all generated data, links, and comments. This cannot be undone!")) {
                    const res = await fetch("/api/user/me", { method: "DELETE" });
                    if (res.ok) {
                      mutate();
                      window.location.href = "/dashboard";
                    }
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
