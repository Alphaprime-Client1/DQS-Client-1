"use client";
import { QrCode } from "lucide-react";

interface TextPageProps {
  body: string;
  qrName: string;
}

export function TextPage({ body, qrName }: TextPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h1 className="text-sm font-semibold text-purple-300 uppercase tracking-widest mb-4">{qrName}</h1>
          <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{body}</p>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8 text-white/40 text-xs">
          <QrCode className="w-4 h-4" />
          <span>Powered by DQCR</span>
        </div>
      </div>
    </div>
  );
}
