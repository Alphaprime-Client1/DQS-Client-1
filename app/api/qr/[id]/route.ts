import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { ScanLog } from "@/models/ScanLog";
import { User } from "@/models/User";
import { rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const country = req.headers.get("cf-ipcountry") || undefined;
  const { id } = params;

  try {
    if (!rateLimit(ip, 60, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = params;
    await dbConnect();

    const qr = await QRCode.findOne({ uniqueId: id, isActive: true }).select("-__v");
    if (!qr) {
      return NextResponse.json({ error: "QR code not found or inactive" }, { status: 404 });
    }

    // Increment scanCount safely
    qr.scanCount += 1;
    await qr.save();

    await ScanLog.create({
      qrId: qr._id,
      userAgent,
      country,
    });

    return NextResponse.json(qr);
  } catch (error) {
    console.error("Fetch QR error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(["link", "text", "image", "multi"]).optional(),
  content: z.any().optional(),
  design: z.object({
    size: z.number().min(100).max(500).default(300),
    fgColor: z.string().default("#000000"),
    bgColor: z.string().default("#ffffff"),
    logoUrl: z.string().optional(),
    logoSize: z.number().min(0.1).max(0.9).optional(),
    dotStyle: z.string().optional(),
    cornerStyle: z.string().optional(),
    cornerColor: z.string().optional(),
    frameStyle: z.string().optional(),
    gradientConfig: z.any().optional(),
  }).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();

    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const qr = await QRCode.findOne({ uniqueId: id });
    if (!qr) return NextResponse.json({ error: "QR code not found" }, { status: 404 });

    if (qr.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    // Strict URL Validation
    const isValidUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    };

    if (validatedData.type === "link" && validatedData.content?.url) {
      if (!isValidUrl(validatedData.content.url)) {
        return NextResponse.json({ error: "Invalid destination URL" }, { status: 400 });
      }
    } else if (validatedData.type === "image" && validatedData.content?.url) {
      if (!isValidUrl(validatedData.content.url)) {
        return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
      }
    } else if (validatedData.type === "multi" && validatedData.content?.actions) {
      for (const action of validatedData.content.actions) {
        if (action.value && !isValidUrl(action.value)) {
          return NextResponse.json({ error: `Invalid URL for ${action.label || 'Action'}` }, { status: 400 });
        }
      }
    }

    // Removed restriction initially locking logoUrl to Pro plan
    // if (user.plan === "free" && validatedData.design?.logoUrl) {
    //   validatedData.design.logoUrl = undefined;
    // }

    const updates = { ...validatedData };

    Object.assign(qr, updates);
    
    // Mongoose needs explicit notification for Mixed types or nested objects
    // modified via Object.assign to guarantee they are saved correctly.
    qr.markModified("content");
    qr.markModified("design");
    
    await qr.save();

    return NextResponse.json(qr);
  } catch (error: any) {
    console.error("Update QR error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    await dbConnect();

    const qr = await QRCode.findOne({ uniqueId: id });
    if (!qr) return NextResponse.json({ error: "QR code not found" }, { status: 404 });

    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (qr.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await QRCode.deleteOne({ _id: qr._id });
    await ScanLog.deleteMany({ qrId: qr._id });
    
    user.qrCount = Math.max(0, user.qrCount - 1);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete QR error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
