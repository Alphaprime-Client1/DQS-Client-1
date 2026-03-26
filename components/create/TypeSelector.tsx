"use client";
import { Link2, FileText, Image, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export type QRType = "link" | "text" | "image" | "multi";

const types: { type: QRType; label: string; description: string; icon: any; gradient: string }[] = [
  {
    type: "link",
    label: "Link",
    description: "Redirect to any URL",
    icon: Link2,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    type: "text",
    label: "Text",
    description: "Display a text message",
    icon: FileText,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    type: "image",
    label: "Image",
    description: "Show a full-screen image",
    icon: Image,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    type: "multi",
    label: "Multi-Action",
    description: "Linktree-style button page",
    icon: LayoutGrid,
    gradient: "from-purple-500 to-violet-600",
  },
];

interface TypeSelectorProps {
  selected: QRType;
  onSelect: (type: QRType) => void;
}

export function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {types.map(({ type, label, description, icon: Icon, gradient }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "group relative flex flex-col gap-3 rounded-xl p-4 border-2 text-left transition-all duration-200 hover:shadow-lg",
            selected === type
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
              : "border-border hover:border-primary/40"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center transition-transform group-hover:scale-110",
              gradient
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          {selected === type && (
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
