"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { QRStyled, QRStyledRef } from "@/components/create/QRStyled";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  Trash2,
  Download,
  Copy,
  BarChart2,
  Eye,
  Calendar,
  Link2,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QRCardProps {
  qr: {
    _id: string;
    uniqueId: string;
    name: string;
    type: "link" | "text" | "image" | "multi";
    scanCount: number;
    commentCount: number;
    isActive: boolean;
    createdAt: string;
    design: { size: number; fgColor: string; bgColor: string; logoUrl?: string; logoSize?: number; dotStyle?: string; cornerStyle?: string; cornerColor?: string; frameStyle?: string; gradientConfig?: any };
  };
  onDelete: (id: string) => void;
}

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  link: { label: "Link", icon: Link2, color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  text: { label: "Text", icon: FileText, color: "bg-green-500/10 text-green-600 border-green-200" },
  image: { label: "Image", icon: Image, color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  multi: { label: "Multi", icon: LayoutGrid, color: "bg-purple-500/10 text-purple-600 border-purple-200" },
};

export function QRCard({ qr, onDelete }: QRCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const qrRef = useRef<QRStyledRef>(null);
  const typeInfo = typeConfig[qr.type] || typeConfig.link;
  const TypeIcon = typeInfo.icon;

  const scanUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/qr/${qr.uniqueId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scanUrl);
    toast({ title: "Link copied!", description: scanUrl });
  };

  const handleDownload = () => {
    if (qrRef.current) {
      qrRef.current.downloadQR("png", 1024);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/qr/${qr.uniqueId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "QR deleted successfully" });
      onDelete(qr._id);
    } catch {
      toast({ title: "Failed to delete QR", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="group overflow-hidden border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 animate-slide-up">
      {/* QR Preview Header */}
      <div
        className="h-40 flex items-center justify-center relative"
        style={{ backgroundColor: qr.design.bgColor }}
      >
        <div className="w-28 h-28 relative overflow-hidden flex items-center justify-center">
          <div className="absolute transform scale-[0.4] origin-center">
            <QRStyled
              ref={qrRef}
              value={scanUrl}
              size={280}
              fgColor={qr.design.fgColor}
              bgColor={qr.design.bgColor}
              logo={qr.design.logoUrl}
              logoSize={qr.design.logoSize}
              dotStyle={qr.design.dotStyle as any}
              cornerStyle={qr.design.cornerStyle as any}
              cornerColor={qr.design.cornerColor}
              frameStyle={qr.design.frameStyle as any}
              gradientConfig={qr.design.gradientConfig}
            />
          </div>
        </div>
        {/* Active badge */}
        <div className="absolute top-3 right-3">
          <div className={`w-2 h-2 rounded-full ${qr.isActive ? "bg-green-400 shadow-green-400/50 shadow-lg" : "bg-gray-400"}`} />
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 space-y-3">
        {/* Name + Type */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">{qr.name}</h3>
          <Badge
            variant="outline"
            className={`text-xs shrink-0 gap-1 ${typeInfo.color}`}
          >
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {qr.scanCount} scans / clicks
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {qr.commentCount ?? 0}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(qr.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-primary"
            onClick={() => router.push(`/edit/${qr.uniqueId}`)}
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-indigo-500"
            onClick={() => window.open(scanUrl, '_blank')}
            title="View Comments"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-sky-500"
            onClick={() => router.push(`/analytics/${qr.uniqueId}`)}
            title="Analytics"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-green-500"
            onClick={handleCopy}
            title="Copy link"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-blue-500"
            onClick={handleDownload}
            title="Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive ml-auto"
                title="Delete"
                disabled={deleting}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete QR Code?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete &quot;{qr.name}&quot; and all its scan logs. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}


