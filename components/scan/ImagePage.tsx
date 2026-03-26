"use client";
import Image from "next/image";
import { QrCode } from "lucide-react";

interface ImagePageProps {
  url: string;
  caption?: string;
  qrName: string;
}

export function ImagePage({ url, caption, qrName }: ImagePageProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl px-4">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "1/1" }}>
          <Image
            src={url}
            alt={caption || qrName}
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        {caption && (
          <p className="text-white/70 text-center mt-4 text-sm">{caption}</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 text-white/30 text-xs">
        <QrCode className="w-4 h-4" />
        <span>Powered by DQCR</span>
      </div>
    </div>
  );
}
