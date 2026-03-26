"use client";
import { Link as LinkIcon, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkPageProps {
  url: string;
  qrName: string;
}

export function LinkPage({ url, qrName }: LinkPageProps) {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LinkIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-sm font-semibold text-blue-300 uppercase tracking-widest mb-4">
            {qrName}
          </h1>
          <p className="text-white text-lg font-medium mb-8 break-all">
            {url}
          </p>
          <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-14 text-lg font-semibold">
            <a href={url} target="_blank" rel="noopener noreferrer">
              Visit Link &rarr;
            </a>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
          <QrCode className="w-4 h-4" />
          <span>Powered by DQCR</span>
        </div>
      </div>
    </div>
  );
}
