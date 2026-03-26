"use client";

import React, { useState, useEffect } from "react";
import { GradientConfig } from "./QRStyled";

interface QRGradientPickerProps {
  value: string;
  onChange: (config: GradientConfig) => void;
  initialConfig?: GradientConfig;
  /** Controlled blend — driven by the parent's Smooth Blend toggle */
  blend: boolean;
}

const FLAG_PRESETS = [
  { name: "High Contrast", colors: ["#000000", "#00DDB4"], direction: "diagonal" as const, blend: true },
  { name: "Cyber", colors: ["#FF00FF", "#00FFFF", "#0000FF"], direction: "diagonal" as const, blend: true },
  { name: "India 🇮🇳", colors: ["#FF9933", "#F5F5F5", "#138808"], direction: "vertical" as const, blend: false },
  { name: "France 🇫🇷", colors: ["#002395", "#F5F5F5", "#ED2939"], direction: "horizontal" as const, blend: false },
  { name: "Germany 🇩🇪", colors: ["#000000", "#DD0000", "#FFCE00"], direction: "vertical" as const, blend: false },
  {
    name: "Pride 🏳️‍🌈",
    colors: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#732982"],
    direction: "horizontal" as const,
    blend: false,
  },
  { name: "Midnight", colors: ["#0F172A", "#1E293B", "#334155"], direction: "vertical" as const, blend: true },
  { name: "Vibrant", colors: ["#7C3AED", "#DB2777", "#F59E0B"], direction: "diagonal" as const, blend: true },
];

export const QRGradientPicker: React.FC<QRGradientPickerProps> = ({
  onChange,
  initialConfig,
  blend,
}) => {
  const [direction, setDirection] = useState<"horizontal" | "vertical" | "diagonal">(
    initialConfig?.direction || "vertical"
  );
  const [colors, setColors] = useState<string[]>(
    initialConfig?.colors || ["#FF9933", "#E2E8F0", "#138808"]
  );

  // Notify parent on mount
  useEffect(() => {
    onChange({ direction, colors, blend });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-notify parent whenever the parent's blend toggle changes
  useEffect(() => {
    onChange({ direction, colors, blend });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blend]);

  const triggerChange = (
    dir: "horizontal" | "vertical" | "diagonal",
    newColors: string[],
    newBlend: boolean
  ) => {
    setDirection(dir);
    setColors(newColors);
    onChange({ direction: dir, colors: newColors, blend: newBlend });
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    triggerChange(direction, newColors, blend);
  };

  const addColor = () => {
    if (colors.length < 6) triggerChange(direction, [...colors, "#000000"], blend);
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      triggerChange(direction, colors.filter((_, i) => i !== index), blend);
    }
  };

  // Applying a preset updates colors + direction only; blend is owned by the parent toggle
  const applyPreset = (preset: (typeof FLAG_PRESETS)[0]) => {
    setDirection(preset.direction);
    setColors(preset.colors);
    onChange({ direction: preset.direction, colors: preset.colors, blend });
  };

  return (
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white space-y-8 w-full shadow-2xl">

      {/* Presets */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 mb-3 block tracking-wide uppercase">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {FLAG_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs hover:border-[#00DDB4] hover:bg-white/10 hover:text-[#00DDB4] transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color Layers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
            Color Layers
          </label>
          <span className="text-xs text-zinc-500">{colors.length} layers · max 6</span>
        </div>

        <div className="flex flex-col gap-3">
          {colors.map((color, i) => (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 bg-black/40 p-2 pl-4 rounded-xl border border-white/5 group"
            >
              <span className="text-xs text-zinc-500 font-medium w-14 shrink-0">Layer {i + 1}</span>
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-full h-8 rounded-md cursor-pointer bg-transparent border-0 p-0"
                />
              </div>
              <span className="hidden sm:block text-xs font-mono text-zinc-400 w-16 shrink-0">
                {color.toUpperCase()}
              </span>
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(i)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          {colors.length < 6 && (
            <button
              onClick={addColor}
              className="w-full py-3 rounded-xl border border-dashed border-white/20 text-xs font-medium text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
            >
              + Add Color Layer
            </button>
          )}
        </div>
      </div>

      {/* Direction */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 mb-3 block tracking-wide uppercase">
          Direction
        </label>
        <select
          value={direction}
          onChange={(e) => triggerChange(e.target.value as any, colors, blend)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00DDB4] transition-colors appearance-none"
        >
          <option value="horizontal">Horizontal (Left → Right)</option>
          <option value="vertical">Vertical (Top → Bottom)</option>
          <option value="diagonal">Diagonal (Corner)</option>
        </select>
      </div>

    </div>
  );
};
