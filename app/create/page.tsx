"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TypeSelector, QRType } from "@/components/create/TypeSelector";
import QRStylePicker, { QRFinalConfig } from "@/components/create/QRStylePicker";
import { QRStyled, QRStyledRef } from "@/components/create/QRStyled";
import { MultiActionBuilder, Action } from "@/components/create/MultiActionBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Loader2, Download, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Type", "Design", "Preview & Save"];

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

function getQRValue(type: QRType, content: any): string {
  if (!content) return "https://dqcr.alphaprime.co.in";
  if (type === "link") return content.url || "https://dqcr.alphaprime.co.in";
  if (type === "text") return content.body || "DQCR QR";
  if (type === "image") return content.url || "https://dqcr.alphaprime.co.in";
  if (type === "multi") return `${window.location.origin}/qr/preview`;
  return "https://dqcr.alphaprime.co.in";
}

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const qrRef = useRef<QRStyledRef>(null);

  const [step, setStep] = useState(0);
  const [qrType, setQrType] = useState<QRType>("link");
  const [content, setContent] = useState<any>({});
  const [multiTitle, setMultiTitle] = useState("Choose an option");
  const [actions, setActions] = useState<Action[]>([
    { label: "Visit Website", type: "link", value: "" },
  ]);
  const [design, setDesign] = useState({ 
    size: 260, 
    fgColor: "#000000", 
    bgColor: "#ffffff", 
    logoUrl: "",
    dotStyle: "rounded" as const,
    cornerStyle: "extra-rounded" as const,
    frameStyle: "none" as const,
    gradientConfig: undefined as any,
    logoSize: 0.2,
    cornerColor: "",
  });
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const plan = (session?.user as any)?.plan ?? "free";
  const isPro = plan === "pro";

  const qrValue = typeof window !== "undefined" ? getQRValue(qrType, qrType === "multi" ? { title: multiTitle, actions } : content) : "https://dqcr.alphaprime.co.in";

  const validateContent = () => {
    if (qrType === "link") {
      if (!content.url?.trim()) return "Please enter a destination URL";
      if (!isValidUrl(content.url)) return "Please enter a valid URL (e.g. https://google.com)";
    }
    if (qrType === "text" && !content.body?.trim()) return "Please enter a message";
    if (qrType === "image") {
      if (!content.url?.trim()) return "Please enter an image URL";
      if (!isValidUrl(content.url)) return "Please enter a valid image URL (e.g. https://example.com/photo.jpg)";
    }
    if (qrType === "multi") {
      if (!multiTitle?.trim()) return "Please enter a title for the multi-link page";
      if (!actions || actions.length === 0) return "Please add at least one link/action";
      for (const action of actions) {
        if (!action.label?.trim() || !action.value?.trim()) return "Please fill in all action labels and URLs";
        if (!isValidUrl(action.value)) return `Invalid URL for "${action.label}": ${action.value}`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateContent();
    if (error) {
      toast({ title: error, variant: "destructive", description: "Please go back to Step 1 to fix this." });
      setStep(0);
      return;
    }

    if (!name.trim()) {
      toast({ title: "Please enter a name for your QR code", variant: "destructive" });
      return;
    }

    const finalContent = qrType === "multi"
      ? { title: multiTitle, actions }
      : content;

    setSaving(true);
    try {
      const res = await fetch("/api/qr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content: finalContent, design }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Failed to create QR code", variant: "destructive" });
        return;
      }

      toast({ title: "QR Code created!", description: "Redirecting to dashboard..." });
      router.push("/dashboard");
    } catch {
      toast({ title: "Network error. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadFromCreate = () => {
    if (qrRef.current) {
      qrRef.current.downloadQR("png", 300);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create QR Code</h1>
            <p className="text-muted-foreground text-sm">Build your dynamic QR in 3 steps</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                i === step
                  ? "gradient-primary text-white shadow-md shadow-primary/30"
                  : i < step
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">
                  {i + 1}
                </span>
                <span className="hidden sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("h-px w-8 transition-colors", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <div className={cn("grid gap-8", step === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3")}>
          {/* Main content area */}
          <div className={cn(step === 1 ? "w-full" : "lg:col-span-2")}>
            <Card className="p-6 border border-border/50">
              {/* Step 1: Type */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Choose QR type</h2>
                    <p className="text-muted-foreground text-sm">What should happen when someone scans your QR?</p>
                  </div>
                  <TypeSelector selected={qrType} onSelect={(t) => { setQrType(t); setContent({}); }} />

                  {/* Content input based on type */}
                  <div className="pt-2 border-t border-border">
                    <h3 className="text-sm font-semibold mb-4">Set content</h3>
                    {qrType === "link" && (
                      <div className="space-y-2">
                        <Label>Destination URL</Label>
                        <div className="relative group/input">
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            className="pr-10 rounded-xl"
                            value={content.url || ""}
                            onChange={(e) => setContent({ url: e.target.value })}
                          />
                          {content.url && (
                            <button
                              type="button"
                              onClick={() => setContent({ ...content, url: "" })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                              aria-label="Clear URL"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {qrType === "text" && (
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                          placeholder="Type your message here..."
                          value={content.body || ""}
                          onChange={(e) => setContent({ body: e.target.value })}
                          rows={4}
                        />
                      </div>
                    )}
                    {qrType === "image" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <div className="relative group/input">
                            <Input
                              type="url"
                              placeholder="https://example.com/photo.jpg"
                              className="pr-10 rounded-xl"
                              value={content.url || ""}
                              onChange={(e) => setContent({ ...content, url: e.target.value })}
                            />
                            {content.url && (
                              <button
                                type="button"
                                onClick={() => setContent({ ...content, url: "" })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                                aria-label="Clear Image URL"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Caption (optional)</Label>
                          <div className="relative group/input">
                            <Input
                              placeholder="A short description"
                              className="pr-10 rounded-xl"
                              value={content.caption || ""}
                              onChange={(e) => setContent({ ...content, caption: e.target.value })}
                            />
                            {content.caption && (
                              <button
                                type="button"
                                onClick={() => setContent({ ...content, caption: "" })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                                aria-label="Clear Caption"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {content.url && (
                          <img src={content.url} alt="preview" className="rounded-lg max-h-32 object-cover" onError={(e: any) => (e.target.style.display = "none")} />
                        )}
                      </div>
                    )}
                    {qrType === "multi" && (
                      <MultiActionBuilder
                        title={multiTitle}
                        actions={actions}
                        onTitleChange={setMultiTitle}
                        onActionsChange={setActions}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Design */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Customize design</h2>
                    <p className="text-muted-foreground text-sm">Make your QR code visually unique</p>
                  </div>
                  <QRStylePicker 
                    value={qrValue} 
                    onStyleChange={(config) => {
                      setDesign({ 
                        size: 300, 
                        fgColor: config.fgColor, 
                        bgColor: config.bgColor, 
                        logoUrl: config.logo || "",
                        logoSize: config.logoSize,
                        dotStyle: config.dotStyle as any,
                        cornerStyle: config.cornerStyle as any,
                        cornerColor: config.cornerColor,
                        frameStyle: config.frameStyle as any,
                        gradientConfig: config.gradientConfig
                      });
                    }} 
                  />
                </div>
              )}

              {/* Step 3: Preview & Save */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Preview & Save</h2>
                    <p className="text-muted-foreground text-sm">Give your QR code a name and save it</p>
                  </div>
                  <div className="space-y-2">
                    <Label>QR Code Name *</Label>
                    <div className="relative group/input">
                      <Input
                        placeholder="e.g. Marketing Campaign 2025"
                        className="pr-10 rounded-xl"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {name && (
                        <button
                          type="button"
                          onClick={() => setName("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                          aria-label="Clear Name"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">This is only visible to you in your dashboard</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="gradient-primary text-white border-0 gap-2 flex-1"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? "Saving..." : "Save QR Code"}
                    </Button>
                    <Button variant="outline" onClick={handleDownloadFromCreate} className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Button>
                {step < STEPS.length - 1 && (
                  <Button
                    onClick={() => {
                      if (step === 0) {
                        const error = validateContent();
                        if (error) {
                          toast({ title: error, variant: "destructive" });
                          return;
                        }
                      }
                      setStep((s) => s + 1);
                    }}
                    className="gradient-primary text-white border-0 gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Live Preview (hidden in step 1 since QRStylePicker has its own) */}
          {step !== 1 && (
            <div className="lg:col-span-1">
              <Card className="p-6 border border-border/50 sticky top-24">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Live Preview</h3>
                <div className="flex justify-center">
                  <QRStyled
                    ref={qrRef}
                    value={qrValue}
                    size={Math.min(design.size, 260)}
                    fgColor={design.fgColor}
                    bgColor={design.bgColor}
                    logo={design.logoUrl}
                    logoSize={design.logoSize}
                    dotStyle={design.dotStyle}
                    cornerStyle={design.cornerStyle}
                    cornerColor={design.cornerColor}
                    frameStyle={design.frameStyle}
                    gradientConfig={design.gradientConfig}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
