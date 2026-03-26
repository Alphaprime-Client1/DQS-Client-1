"use client";

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from "react";
import { GradientConfig, QRStyled, QRStyledRef } from "./QRStyled";
import { QRGradientPicker } from "./QRGradientPicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, UploadCloud, Trash2, CheckCircle2 } from "lucide-react";

export type QRFinalConfig = {
  dotStyle: string;
  fgColor: string;
  bgColor: string;
  cornerStyle: string;
  cornerColor: string;
  logo?: string;
  logoSize: number;
  frameStyle: "none" | "scanme" | "brackets";
  gradientConfig?: GradientConfig;
};

// Default gradient so any brand-new QR starts with India flag colours
// Default gradient: High contrast colors work best for scanning
export const DEFAULT_GRADIENT: GradientConfig = {
  direction: "vertical",
  colors: ["#FF9933", "#E2E8F0", "#138808"], // Slightly darker off-white for better scan on light backgrounds
  blend: false,
};

interface QRStylePickerProps {
  value: string;
  onStyleChange?: (config: QRFinalConfig) => void;
  // Optional initial values (used by the edit page to pre-populate from DB)
  initialFgColor?: string;
  initialBgColor?: string;
  initialDotStyle?: string;
  initialCornerStyle?: string;
  initialCornerColor?: string;
  initialFrameStyle?: "none" | "scanme" | "brackets";
  initialGradientConfig?: GradientConfig;
  initialLogo?: string;
  initialLogoSize?: number;
}

const SHAPES = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy+" },
  { id: "extra-rounded", label: "Extra Round" },
];

const CORNERS = [
  { id: "square", label: "Sharp" },
  { id: "dot", label: "Circle" },
  { id: "extra-rounded", label: "Curved" },
];

export default function QRStylePicker({
  value,
  onStyleChange,
  initialFgColor = "#000000",
  initialBgColor = "#ffffff",
  initialDotStyle = "extra-rounded",
  initialCornerStyle = "dot",
  initialCornerColor = "#000000",
  initialFrameStyle = "none",
  initialGradientConfig = DEFAULT_GRADIENT,
  initialLogo,
  initialLogoSize = 0.2,
}: QRStylePickerProps) {
  const qrRef = useRef<QRStyledRef>(null);
  const onStyleChangeRef = useRef(onStyleChange);
  // Keep ref fresh without triggering effects
  useEffect(() => { onStyleChangeRef.current = onStyleChange; });

  const [activeTab, setActiveTab] = useState("colors");
  const [fgColor, setFgColor] = useState(initialFgColor);
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [cornerColor, setCornerColor] = useState(initialCornerColor);
  const [dotStyle, setDotStyle] = useState(initialDotStyle);
  const [cornerStyle, setCornerStyle] = useState(initialCornerStyle);
  const [logo, setLogo] = useState<string | undefined>(initialLogo);
  const [logoSize, setLogoSize] = useState(initialLogoSize);
  const [frameStyle, setFrameStyle] = useState<"none" | "scanme" | "brackets">(initialFrameStyle);

  const [smoothBlend, setSmoothBlend] = useState(initialGradientConfig?.blend ?? false);
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>(initialGradientConfig);

  const handleSmoothBlendChange = (val: boolean) => {
    setSmoothBlend(val);
    setGradientConfig(prev => ({ ...prev, blend: val }));
  };

  const buildConfig = useCallback((): QRFinalConfig => ({
    dotStyle,
    fgColor,
    bgColor,
    cornerStyle,
    cornerColor,
    logo,
    logoSize,
    frameStyle,
    gradientConfig, // always active — 3-layer colours always in use
  }), [dotStyle, fgColor, bgColor, cornerStyle, cornerColor, logo, logoSize, frameStyle, gradientConfig]);

  // Fire on mount AND on every change — no isMounted guard needed.
  // The infinite-loop risk is eliminated because onStyleChange is accessed via ref (stable reference).
  useEffect(() => {
    onStyleChangeRef.current?.(buildConfig());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildConfig]); // onStyleChange deliberately excluded via ref pattern

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full text-white font-sans space-y-6">

      {/* ── Live Mini Preview ── */}
      <div className="flex flex-col xs:flex-row items-center gap-4 sm:gap-6 bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="shrink-0 bg-white/5 p-2.5 rounded-2xl border border-white/10 shadow-lg">
          <QRStyled
            ref={qrRef}
            value={value || "https://dqcr.alphaprime.co.in"}
            size={148}
            dotStyle={dotStyle as any}
            fgColor={undefined}
            bgColor={bgColor}
            cornerStyle={cornerStyle as any}
            cornerColor={cornerColor}
            logo={logo}
            logoSize={logoSize}
            frameStyle={frameStyle}
            gradientConfig={gradientConfig}
          />
        </div>

        <div className="flex-1 w-full min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">Live Preview</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">Design saves when you click Save / Save Changes.</p>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => qrRef.current?.downloadQR("png", 1000)}
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-[#00DDB4]/50 h-9 rounded-xl text-xs gap-2"
            >
              <Download className="w-3.5 h-3.5" /> PNG
            </Button>
            <Button
              variant="outline"
              onClick={() => qrRef.current?.downloadQR("svg")}
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-[#00DDB4]/50 h-9 rounded-xl text-xs gap-2"
            >
              <Download className="w-3.5 h-3.5" /> SVG
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-zinc-950/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00DDB4]/10 rounded-full blur-[60px] -z-10 pointer-events-none" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
            <TabsTrigger value="colors" className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-[#00DDB4] data-[state=active]:text-black transition-all">Colors</TabsTrigger>
            <TabsTrigger value="shapes" className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-[#00DDB4] data-[state=active]:text-black transition-all">Shapes</TabsTrigger>
            <TabsTrigger value="frames" className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-[#00DDB4] data-[state=active]:text-black transition-all">Frames</TabsTrigger>
          </TabsList>

          {/* ── COLORS TAB ── */}
          <TabsContent value="colors" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Smooth Blend toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-white">Smooth Color Blend</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  OFF = solid flag stripes &nbsp;·&nbsp; ON = smooth gradient
                </p>
              </div>
              <Switch
                checked={smoothBlend}
                onCheckedChange={handleSmoothBlendChange}
                className="data-[state=checked]:bg-[#00DDB4]"
              />
            </div>

            <QRGradientPicker
              value={value || "https://dqcr.alphaprime.co.in"}
              onChange={setGradientConfig}
              initialConfig={initialGradientConfig}
              blend={smoothBlend}
            />

            {/* Background */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Background Color</Label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-xs font-mono text-zinc-400">{bgColor.toUpperCase()}</span>
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setBgColor("#ffffff")} className="text-[10px] px-2 py-1 rounded-lg bg-white text-black font-medium">White</button>
                  <button onClick={() => setBgColor("#000000")} className="text-[10px] px-2 py-1 rounded-lg bg-zinc-800 text-white font-medium border border-white/10">Black</button>
                  <button onClick={() => setBgColor("#010104")} className="text-[10px] px-2 py-1 rounded-lg bg-[#010104] text-white font-medium border border-white/10">Dark</button>
                </div>
              </div>
              <p className="text-[10px] text-orange-400 font-medium mt-2 bg-orange-400/5 p-2 rounded-lg border border-orange-400/20">
                ⚠️ Scanning Tip: For best results, use dark colors for the QR pattern and a light color for its background. 
                Avoid using thin/light colors for the pattern as they might not scan. 
              </p>
            </div>

          </TabsContent>

          {/* ── SHAPES & LOGO TAB ── */}
          <TabsContent value="shapes" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

            <div className="space-y-3">
              <Label className="text-xs font-semibold tracking-wide uppercase text-zinc-400">Dot Pattern</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setDotStyle(shape.id)}
                    className={cn(
                      "p-3 rounded-xl border flex items-center justify-between text-left cursor-pointer transition-all",
                      dotStyle === shape.id
                        ? "bg-[#00DDB4]/10 border-[#00DDB4] text-[#00DDB4]"
                        : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/30"
                    )}
                  >
                    <span className="text-xs font-medium">{shape.label}</span>
                    {dotStyle === shape.id && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold tracking-wide uppercase text-zinc-400">Corner Style</Label>
              <div className="grid grid-cols-3 gap-2">
                {CORNERS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCornerStyle(c.id)}
                    className={cn(
                      "p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                      cornerStyle === c.id
                        ? "bg-[#00DDB4]/10 border-[#00DDB4] text-[#00DDB4]"
                        : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/30"
                    )}
                  >
                    <span className="text-xs font-medium">{c.label}</span>
                    {cornerStyle === c.id && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <Label className="text-xs font-semibold tracking-wide uppercase text-zinc-400">Center Logo</Label>

              {!logo ? (
                <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#00DDB4]/50 hover:bg-[#00DDB4]/5 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                    <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-[#00DDB4]" />
                  </div>
                  <span className="text-sm font-medium text-white">Upload logo</span>
                  <span className="text-[11px] text-zinc-500 mt-1">PNG / JPG / SVG — Max 2MB</span>
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-black/50 p-1.5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Logo uploaded</p>
                      <button onClick={() => setLogo(undefined)} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs mt-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>Logo Size (Max 35% for scan)</span>
                      <span className="text-[#00DDB4] font-medium">{Math.round(logoSize * 100)}%</span>
                    </div>
                    <Slider value={[logoSize]} onValueChange={([val]) => setLogoSize(val)} min={0.1} max={0.35} step={0.01} className="py-1" />
                  </div>
                </div>
              )}
            </div>

          </TabsContent>

          {/* ── FRAMES TAB ── */}
          <TabsContent value="frames" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Label className="text-xs font-semibold tracking-wide uppercase text-zinc-400 block">Frame Style</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "none", label: "No Frame", desc: "Clean & bare" },
                { id: "scanme", label: "Scan Me", desc: "High conversion" },
                { id: "brackets", label: "Brackets", desc: "Tech aesthetic" },
              ].map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setFrameStyle(frame.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all",
                    frameStyle === frame.id
                      ? "bg-[#00DDB4]/10 border-[#00DDB4] shadow-[0_0_20px_rgba(0,221,180,0.15)]"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  )}
                >
                  {frame.id === "none" && <div className="w-10 h-10 border-2 border-dashed border-zinc-600 rounded-lg mb-2" />}
                  {frame.id === "scanme" && (
                    <div className="px-2 py-1 rounded-lg border-2 border-[#00DDB4] text-[9px] font-bold text-[#00DDB4] uppercase tracking-widest mb-2 flex flex-col items-center gap-1">
                      <div className="w-5 h-5 bg-white/10 rounded-sm" />
                      SCAN ME
                    </div>
                  )}
                  {frame.id === "brackets" && (
                    <div className="w-10 h-10 relative mb-2">
                      <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#00DDB4]" />
                      <div className="absolute top-0 left-0 w-0.5 h-2 bg-[#00DDB4]" />
                      <div className="absolute top-0 right-0 w-2 h-0.5 bg-[#00DDB4]" />
                      <div className="absolute top-0 right-0 w-0.5 h-2 bg-[#00DDB4]" />
                      <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-[#00DDB4]" />
                      <div className="absolute bottom-0 left-0 w-0.5 h-2 bg-[#00DDB4]" />
                      <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-[#00DDB4]" />
                      <div className="absolute bottom-0 right-0 w-0.5 h-2 bg-[#00DDB4]" />
                    </div>
                  )}
                  <span className="text-sm font-semibold text-white">{frame.label}</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">{frame.desc}</span>
                </button>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
