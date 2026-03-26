import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Comment } from "@/models/Comment";
import { User } from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qrId = searchParams.get("qrId");

    if (!qrId) {
      return NextResponse.json({ error: "Missing qrId" }, { status: 400 });
    }

    await dbConnect();
    
    // Ensure User model is loaded for populate
    const comments = await Comment.find({ qrId })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", model: User, select: "name image" })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { qrId, text, parentId } = await req.json();

    if (!qrId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    let userId = (session.user as any).dbId;
    if (!userId) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userId = user._id;
    }

    const newComment = await Comment.create({
      qrId,
      userId,
      text,
      parentId: parentId || null,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate({ path: "userId", model: User, select: "name image" })
      .lean();

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
