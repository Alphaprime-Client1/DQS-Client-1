"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  Calendar,
  User as UserIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
}

export default function CommentsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrName, setQrName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!id || status !== "authenticated") return;
    fetchData();
  }, [id, status]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const qrRes = await fetch(`/api/qr/${id}/details`);
      if (!qrRes.ok) {
        toast({ title: "Access denied or QR not found", variant: "destructive" });
        router.push("/dashboard");
        return;
      }
      
      const qrData = await qrRes.json();
      setQrName(qrData.name);

      const commentsRes = await fetch(`/api/comments?qrId=${qrData._id}`);
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
    } catch {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
        toast({ title: "Comment deleted" });
      } else {
        toast({ title: "Failed to delete comment", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete comment", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-10 max-w-5xl space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">Comments</h1>
              {qrName && (
                <Badge variant="secondary" className="text-sm font-normal">{qrName}</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Manage comments for this QR code
            </p>
          </div>
        </div>

        <Card className="mt-6 border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="font-semibold">All Comments ({comments.length})</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Moderate audience feedback</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No comments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  comments.map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.userId?.image} />
                            <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{comment.userId?.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-[300px] truncate">{comment.text}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this comment?")) {
                              handleDelete(comment._id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
