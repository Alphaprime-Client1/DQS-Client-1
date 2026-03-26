import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { ScanLog } from "@/models/ScanLog";
import { headers } from "next/headers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "unknown";
  const country = headersList.get("cf-ipcountry") || undefined;

  try {
    await dbConnect();
    
    // We update by uniqueId (Nanoid)
    const qr = await QRCode.findOneAndUpdate(
      { uniqueId: id },
      { $inc: { scanCount: 1 } },
      { new: true }
    );

    if (!qr) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await ScanLog.create({
      qrId: qr._id,
      userAgent,
      country,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Scan API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
