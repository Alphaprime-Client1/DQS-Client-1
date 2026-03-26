import { QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QRNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 glow opacity-60">
        <QrCode className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">QR Code Not Found</h1>
      <p className="text-white/50 mb-8 max-w-sm">
        This QR code is inactive or doesn&apos;t exist. It may have been deleted by its owner.
      </p>
      <Link href="/">
        <Button className="gradient-primary text-white border-0">
          Go to DQCR
        </Button>
      </Link>
    </div>
  );
}
