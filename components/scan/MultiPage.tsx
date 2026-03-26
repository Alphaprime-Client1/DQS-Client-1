"use client";
import { useState } from "react";
import Image from "next/image";
import { QrCode, Link2, FileText, Image as ImageIcon, ExternalLink } from "lucide-react";

interface Action {
  label: string;
  type: "link" | "text" | "image";
  value: string;
}

interface MultiPageProps {
  title: string;
  actions: Action[];
  qrName: string;
}

export function MultiPage({ title, actions, qrName }: MultiPageProps) {
  const [modal, setModal] = useState<{ type: string; value: string } | null>(null);

  const handleAction = (action: Action) => {
    if (action.type === "link") {
      window.open(action.value, "_blank", "noopener,noreferrer");
    } else {
      setModal({ type: action.type, value: action.value });
    }
  };

  const iconMap = { link: Link2, text: FileText, image: ImageIcon };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">{title}</h1>
          <p className="text-white/50 text-sm mt-1">{qrName}</p>
        </div>

        {/* Action buttons */}
        {actions.map((action, i) => {
          const Icon = iconMap[action.type] || Link2;
          return (
            <button
              key={i}
              onClick={() => handleAction(action)}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 text-white border border-white/10 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Icon className="w-5 h-5 text-purple-300 shrink-0" />
              <span className="flex-1 text-left font-medium">{action.label}</span>
              {action.type === "link" && (
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
              )}
            </button>
          );
        })}
      </div>

      {/* Brand */}
      <div className="flex items-center justify-center gap-2 mt-12 text-white/30 text-xs">
        <QrCode className="w-4 h-4" />
        <span>Powered by DQCR</span>
      </div>

      {/* Modal for text/image actions */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-lg w-full border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.type === "text" ? (
              <p className="text-white leading-relaxed whitespace-pre-wrap">{modal.value}</p>
            ) : (
              <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "1/1" }}>
                <Image
                  src={modal.value}
                  alt="Content"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <button
              className="mt-4 text-white/60 text-sm hover:text-white"
              onClick={() => setModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
