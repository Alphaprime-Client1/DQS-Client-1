"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Send, User as UserIcon, 
  ThumbsUp, ThumbsDown, MoreHorizontal, Edit2, 
  Trash2, ShieldAlert, CornerDownRight, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CommentType {
  _id: string;
  text: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  parentId: string | null;
  isEdited: boolean;
  editCount: number;
  userId: {
    _id: string;
    name: string;
    image?: string;
  };
}

export function CommentSection({ qrId, qrOwnerId }: { qrId: string; qrOwnerId: string }) {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const pathname = usePathname();

  // SWR for live refresh every 5 seconds
  const { data: commentsRaw, error, mutate } = useSWR<CommentType[]>(
    `/api/comments?qrId=${qrId}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  const comments = Array.isArray(commentsRaw) ? commentsRaw : [];
  const loading = !commentsRaw && !error;

  const currentUserId = (session?.user as any)?.dbId;

  const handlePost = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const content = parentId ? replyText : text;
    if (!content.trim() || !session) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrId, text: content, parentId }),
      });
      
      if (res.ok) {
        const newComment = await res.json();
        // Optimistic UI update
        mutate([newComment, ...comments], false);
        
        if (parentId) {
          setReplyingTo(null);
          setReplyText("");
          setExpandedReplies(p => ({ ...p, [parentId]: true })); // Expand replies to show new one
        } else {
          setText("");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (commentId: string, action: "like" | "dislike") => {
    if (!currentUserId) return;

    // Optimistic update
    const updatedComments = comments.map(c => {
      if (c._id === commentId) {
        const hasLiked = (c.likes || []).includes(currentUserId);
        const hasDisliked = (c.dislikes || []).includes(currentUserId);

        let newLikes = [...(c.likes || [])];
        let newDislikes = [...(c.dislikes || [])];

        if (action === "like") {
          if (hasLiked) {
            newLikes = newLikes.filter(id => id !== currentUserId);
          } else {
            newLikes.push(currentUserId);
            newDislikes = newDislikes.filter(id => id !== currentUserId);
          }
        } else if (action === "dislike") {
          if (hasDisliked) {
            newDislikes = newDislikes.filter(id => id !== currentUserId);
          } else {
            newDislikes.push(currentUserId);
            newLikes = newLikes.filter(id => id !== currentUserId);
          }
        }

        return { ...c, likes: newLikes, dislikes: newDislikes };
      }
      return c;
    });

    mutate(updatedComments, false);

    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      mutate(); // Revalidate
    } catch (err) {
      console.error(err);
      mutate(); // Revert on failure
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;
    
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", text: editText }),
      });
      if (res.ok) {
        mutate();
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    // Optimistic delete
    mutate(comments.filter(c => c._id !== commentId && c.parentId !== commentId), false);

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) mutate(); 
    } catch (err) {
      console.error(err);
      mutate();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(date);
  };

  // Group root comments and replies
  const rootComments = comments
    .filter(c => !c.parentId)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "popular") return (b.likes?.length || 0) - (a.likes?.length || 0);
      return 0;
    });

  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId).reverse(); 

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComment = (comment: CommentType, isReply = false) => {
    const isOwner = comment.userId?._id === currentUserId;
    const isQRAdminContext = currentUserId === qrOwnerId;
    const isAdminOfComment = comment.userId?._id === qrOwnerId;
    const hasLiked = currentUserId && (comment.likes || []).includes(currentUserId);
    const hasDisliked = currentUserId && (comment.dislikes || []).includes(currentUserId);
    const replies = isReply ? [] : getReplies(comment._id);
    const isExpanded = expandedReplies[comment._id];

    return (
      <div key={comment._id} className={`flex gap-3 group animate-in fade-in ${isReply ? "ml-4 sm:ml-10 mt-4" : "mt-6"}`}>
        <Avatar className="w-10 h-10 border border-zinc-200 dark:border-zinc-800 shrink-0">
          <AvatarImage src={comment.userId?.image || undefined} />
          <AvatarFallback><UserIcon className="w-5 h-5 text-zinc-400" /></AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl px-4 py-3 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {comment.userId?.name?.split(" ")[0] || "Anonymous User"}
                </span>
                {isAdminOfComment && (
                  <Badge variant="default" className="bg-indigo-500 hover:bg-indigo-600 text-[10px] px-1.5 py-0 h-4">
                    Creator
                  </Badge>
                )}
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(comment.createdAt)}
                </span>
                {comment.isEdited && (
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
                    <Edit2 className="w-3 h-3" /> edited {comment.editCount > 1 ? `(${comment.editCount})` : ""}
                  </span>
                )}
              </div>

              {/* Actions Dropdown */}
              {(isOwner || isQRAdminContext) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    {isOwner && (
                      <DropdownMenuItem onClick={() => { setEditingId(comment._id); setEditText(comment.text); }}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                    )}
                    {(isOwner || isQRAdminContext) && (
                      <DropdownMenuItem onClick={() => handleDelete(comment._id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {editingId === comment._id ? (
              <div className="mt-2 text-right space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[60px] text-sm bg-white dark:bg-zinc-900 text-black dark:text-white"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleEdit(comment._id)}>Save</Button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap break-words">
                {comment.text}
              </p>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-4 mt-1.5 ml-1">
            <button
              onClick={() => handleAction(comment._id, "like")}
              disabled={!currentUserId}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                hasLiked ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-indigo-600 dark:fill-indigo-400" : ""}`} />
              {(comment.likes?.length || 0) > 0 && comment.likes.length}
            </button>
            <button
              onClick={() => handleAction(comment._id, "dislike")}
              disabled={!currentUserId}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                hasDisliked ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? "fill-zinc-900 dark:fill-zinc-100" : ""}`} />
              {(comment.dislikes?.length || 0) > 0 && comment.dislikes.length}
            </button>
            
            {!isReply && session && (
              <button
                onClick={() => { setReplyingTo(replyingTo === comment._id ? null : comment._id); setReplyText(""); }}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-indigo-500 transition-colors"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment._id && (
            <form onSubmit={(e) => handlePost(e, comment._id)} className="mt-3 sm:ml-4 flex gap-2 animate-in slide-in-from-top-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[40px] h-[40px] text-sm bg-zinc-50 dark:bg-zinc-900 resize-none py-2 text-black dark:text-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (replyText.trim()) handlePost(e, comment._id);
                  }
                }}
              />
              <Button type="submit" size="sm" disabled={!replyText.trim() || submitting} className="h-[40px] px-3 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Render Nested Replies Collapse/Expand */}
          {!isReply && replies.length > 0 && (
            <div className="mt-2 ml-1">
              <button 
                onClick={() => toggleReplies(comment._id)}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? "Hide replies" : `View ${replies.length} repl${replies.length === 1 ? "y" : "ies"}`}
              </button>
              
              {isExpanded && (
                <div className="animate-in slide-in-from-top-2">
                  {replies.map(reply => renderComment(reply, true))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16 p-4 sm:p-8 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Comments <span className="text-zinc-400 font-medium text-lg">({comments.length})</span>
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs sm:text-sm">
              <span className="text-zinc-500 font-normal hidden sm:inline">Sort:</span>
              <span className="capitalize">{sortBy}</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl p-1.5 w-40">
            <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-lg py-2">
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldest")} className="rounded-lg py-2">
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("popular")} className="rounded-lg py-2">
              Most Popular
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {status === "loading" ? (
        <div className="h-28 animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8" />
      ) : session ? (
        <form onSubmit={(e) => handlePost(e)} className="mb-10 relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full min-h-[100px] pb-14 resize-none bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 rounded-xl text-black dark:text-white"
            disabled={submitting}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={!text.trim() || submitting}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-8 flex flex-col items-center justify-center text-center bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-500/20">
          <ShieldAlert className="w-8 h-8 text-indigo-400 mb-3" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Join the Conversation</h4>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-5 max-w-sm">
            Sign in to post comments, leave likes, and reply to others.
          </p>
          <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25">
            <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
              Sign In to Comment
            </Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4" />
                <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : rootComments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="text-zinc-900 dark:text-zinc-100 font-medium mb-1">No comments yet</p>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rootComments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
