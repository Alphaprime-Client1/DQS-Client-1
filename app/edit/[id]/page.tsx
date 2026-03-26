"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { TypeSelector, QRType } from "@/components/create/TypeSelector";
import QRStylePicker, { QRFinalConfig } from "@/components/create/QRStylePicker";
import { QRStyled, QRStyledRef } from "@/components/create/QRStyled";
import { useRef } from "react";
import { MultiActionBuilder, Action } from "@/components/create/MultiActionBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save, Clock, X } from "lucide-react";

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function EditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrType, setQrType] = useState<QRType>("link");
  const [content, setContent] = useState<any>({});
  const [multiTitle, setMultiTitle] = useState("Choose an option");
  const [actions, setActions] = useState<Action[]>([]);
  const qrRef = useRef<QRStyledRef>(null);
  const [design, setDesign] = useState({ 
    size: 260, 
    fgColor: "#000000", 
    bgColor: "#ffffff", 
    logoUrl: "",
    logoSize: 0.25,
    dotStyle: "rounded" as const,
    cornerStyle: "extra-rounded" as const,
    cornerColor: "",
    frameStyle: "none" as const,
    gradientConfig: undefined as any
  });
  const [name, setName] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!id || status !== "authenticated") return;
    fetchQR();
  }, [id, status]);

  const fetchQR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/qr/${id}/details`);
      if (!res.ok) {
        toast({ title: "QR not found or access denied", variant: "destructive" });
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setQrType(data.type);
      setName(data.name);
      setDesign({ 
        size: data.design?.size || 260, 
        fgColor: data.design?.fgColor || "#000000", 
        bgColor: data.design?.bgColor || "#ffffff",
        logoUrl: data.design?.logoUrl || "",
        logoSize: data.design?.logoSize || 0.25,
        dotStyle: data.design?.dotStyle || "rounded",
        cornerStyle: data.design?.cornerStyle || "extra-rounded",
        cornerColor: data.design?.cornerColor || "",
        frameStyle: data.design?.frameStyle || "none",
        gradientConfig: data.design?.gradientConfig
      });
      setUpdatedAt(data.updatedAt || data.createdAt);
      if (data.type === "multi") {
        setMultiTitle(data.content?.title || "Choose an option");
        setActions(data.content?.actions || []);
      } else {
        setContent(data.content || {});
      }
    } catch {
      toast({ title: "Failed to load QR code", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const plan = (session?.user as any)?.plan ?? "free";
  const isPro = plan === "pro";

  const qrValue = (() => {
    if (qrType === "link") return content.url || "https://dqcr.alphaprime.co.in";
    if (qrType === "text") return content.body || "DQCR QR";
    if (qrType === "image") return content.url || "https://dqcr.alphaprime.co.in";
    return "https://dqcr.alphaprime.co.in";
  })();

  const validateContent = () => {
    if (qrType === "link") {
      if (!content.url?.trim()) return "Please enter a destination URL";
      if (!isValidUrl(content.url)) return "Please enter a valid URL (e.g. https://google.com)";
    }
    if (qrType === "text" && !content.body?.trim()) return "Please enter a message";
    if (qrType === "image") {
      if (!content.url?.trim()) return "Please enter an image URL";
      if (!isValidUrl(content.url)) return "Please enter a valid image URL";
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
      toast({ title: error, variant: "destructive", description: "Check your content items." });
      return;
    }

    if (!name.trim()) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }

    const finalContent = qrType === "multi" ? { title: multiTitle, actions } : content;
    setSaving(true);
    try {
      const res = await fetch(`/api/qr/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content: finalContent, design }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.error || "Failed to update QR code", variant: "destructive" });
        return;
      }
      toast({ title: "QR Code updated successfully!" });
      setUpdatedAt(data.updatedAt);
    } catch {
      toast({ title: "Network error. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10 max-w-6xl space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-96" />
            </div>
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit QR Code</h1>
            {updatedAt && (
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                Last updated: {new Date(updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name */}
            <Card className="p-6 border border-border/50 space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1">QR Code Settings</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="relative group/input">
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Marketing Campaign" 
                      className="pr-10 rounded-xl"
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
                </div>
              </div>
            </Card>

            {/* Type */}
            <Card className="p-6 border border-border/50 space-y-4">
              <h2 className="text-base font-semibold">QR Type</h2>
              <TypeSelector selected={qrType} onSelect={(t) => { setQrType(t); setContent({}); }} />

              <div className="pt-2 border-t border-border">
                <h3 className="text-sm font-semibold mb-4">Content</h3>
                {qrType === "link" && (
                  <div className="space-y-2">
                    <Label>Destination URL</Label>
                    <div className="relative group/input">
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        className="pr-10 rounded-xl"
                        value={content.url || ""}
                        onChange={(e) => setContent({ ...content, url: e.target.value })}
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
                    <Textarea placeholder="Your message..." value={content.body || ""} onChange={(e) => setContent({ ...content, body: e.target.value })} rows={4} />
                  </div>
                )}
                {qrType === "image" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <div className="relative group/input">
                        <Input
                          type="url"
                          placeholder="https://..."
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
                          placeholder="Caption"
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
                  </div>
                )}
                {qrType === "multi" && (
                  <MultiActionBuilder title={multiTitle} actions={actions} onTitleChange={setMultiTitle} onActionsChange={setActions} />
                )}
              </div>
            </Card>

            {/* Design */}
            <Card className="p-6 border border-border/50 space-y-4">
              <h2 className="text-base font-semibold">Design</h2>
              <QRStylePicker
                key={id} // remount if QR id changes
                value={qrValue}
                initialFgColor={design.fgColor}
                initialBgColor={design.bgColor}
                initialDotStyle={design.dotStyle}
                initialCornerStyle={design.cornerStyle}
                initialCornerColor={design.cornerColor}
                initialFrameStyle={design.frameStyle as any}
                initialGradientConfig={design.gradientConfig || { direction: "vertical", colors: [design.fgColor, design.fgColor, design.fgColor], blend: false }}
                initialLogo={design.logoUrl}
                initialLogoSize={design.logoSize}
                onStyleChange={(config) => {
                  setDesign({
                    size: 260,
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
            </Card>

            {/* Save */}
            <Button onClick={handleSave} disabled={saving} className="gradient-primary text-white border-0 gap-2 w-full h-11">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving changes..." : "Save Changes"}
            </Button>
          </div>

          {/* Preview */}
          <div>
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
        </div>
      </main>
    </div>
  );
}
