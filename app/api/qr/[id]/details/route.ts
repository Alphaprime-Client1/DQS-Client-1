import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { User } from "@/models/User";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  try {
    if (!session || !session.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    await dbConnect();

    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const qr = await QRCode.findOne({ uniqueId: id });
    if (!qr) return NextResponse.json({ error: "QR not found" }, { status: 404 });

    if (qr.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(qr);
  } catch (error) {
    console.error("Fetch QR details error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
