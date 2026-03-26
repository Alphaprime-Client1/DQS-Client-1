import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { Comment } from "@/models/Comment";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  try {
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const qrCodes = await QRCode.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    // Fetch comment counts per QR in one aggregation
    const qrIds = qrCodes.map((qr) => qr._id);
    const commentCounts = await Comment.aggregate([
      { $match: { qrId: { $in: qrIds } } },
      { $group: { _id: "$qrId", count: { $sum: 1 } } },
    ]);
    const commentCountMap: Record<string, number> = {};
    commentCounts.forEach((c) => {
      commentCountMap[c._id.toString()] = c.count;
    });

    const qrCodesWithComments = qrCodes.map((qr) => ({
      ...qr,
      commentCount: commentCountMap[qr._id.toString()] ?? 0,
    }));

    return NextResponse.json({ qrCodes: qrCodesWithComments });
  } catch (error) {
    console.error("List QR error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

