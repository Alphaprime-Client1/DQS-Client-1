import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Comment } from "@/models/Comment";
import { QRCode } from "@/models/QRCode";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { text, action } = await req.json();
    await dbConnect();

    const comment = await Comment.findById(params.id);
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let userId = (session.user as any).dbId;
    if (!userId) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      userId = user._id;
    }

    if (action === "like") {
      const hasLiked = comment.likes.some((id: any) => id.toString() === userId.toString());
      if (hasLiked) {
        comment.likes = comment.likes.filter((id: any) => id.toString() !== userId.toString());
      } else {
        comment.likes.push(userId);
        comment.dislikes = comment.dislikes.filter((id: any) => id.toString() !== userId.toString());
      }
      await comment.save();
    } else if (action === "dislike") {
      const hasDisliked = comment.dislikes.some((id: any) => id.toString() === userId.toString());
      if (hasDisliked) {
        comment.dislikes = comment.dislikes.filter((id: any) => id.toString() !== userId.toString());
      } else {
        comment.dislikes.push(userId);
        comment.likes = comment.likes.filter((id: any) => id.toString() !== userId.toString());
      }
      await comment.save();
    } else if (action === "edit") {
      if (comment.userId.toString() !== userId.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

      comment.text = text;
      comment.isEdited = true;
      comment.editCount += 1;
      await comment.save();
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const populatedComment = await Comment.findById(params.id)
      .populate({ path: "userId", model: User, select: "name image" })
      .lean();
    return NextResponse.json(populatedComment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const comment = await Comment.findById(params.id).populate({ path: "qrId", model: QRCode });
    if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let userId = (session.user as any).dbId;
    if (!userId) {
      const user = await User.findOne({ email: session.user.email });
      userId = user?._id;
    }

    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isQROwner = comment.qrId.userId.toString() === userId.toString();

    if (!isCommentOwner && !isQROwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the comment and any replies
    await Comment.deleteMany({ $or: [{ _id: params.id }, { parentId: params.id }] });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
