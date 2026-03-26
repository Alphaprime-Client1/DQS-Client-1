import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { QRCode } from "@/models/QRCode";
import { ScanLog } from "@/models/ScanLog";
import { Comment } from "@/models/Comment";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  try {
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Detailed Storage Calculation
    const qrs = await QRCode.find({ userId: user._id });
    const commentsCount = await Comment.countDocuments({ userId: user._id });
    
    let storageUsage = qrs.length * 10; // 10 units per QR base
    storageUsage += commentsCount * 2;   // 2 units per Comment
    
    qrs.forEach(qr => {
      if (qr.type === "multi" && qr.content?.actions) {
        storageUsage += (qr.content.actions.length * 2); // 2 units per link
      }
      if (qr.type === "image" || qr.content?.url?.includes("image")) {
        storageUsage += 5; // 5 units for image-based QRs
      }
    });

    const storageLimit = user.plan === "pro" ? 10000 : 100;

    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      plan: user.plan,
      qrCount: user.qrCount,
      storageUsage,
      storageLimit,
    });
  } catch (error) {
    console.error("User ME error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  try {
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    await dbConnect();
    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userQRs = await QRCode.find({ userId: user._id });
    const qrIds = userQRs.map(qr => qr._id);

    await ScanLog.deleteMany({ qrId: { $in: qrIds } });
    await Comment.deleteMany({ $or: [{ userId: user._id }, { qrId: { $in: qrIds } }] });
    await QRCode.deleteMany({ userId: user._id });

    user.qrCount = 0;
    await user.save();

    return NextResponse.json({ success: true, message: "All data cleared successfully" });
  } catch (error) {
    console.error("User data clear error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
