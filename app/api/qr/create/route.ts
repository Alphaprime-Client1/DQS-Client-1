import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { QRCode } from "@/models/QRCode";
import { generateId } from "@/lib/nanoid";
import { z } from "zod";
import { headers } from "next/headers";

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["link", "text", "image", "multi"]),
  content: z.any(),
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
  }),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  try {
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "free" && user.qrCount >= 2) {
      return NextResponse.json(
        { error: "Free plan limit reached. Please upgrade to Pro." },
        { status: 403 }
      );
    }

    const payload = await req.json();
    const validatedData = createSchema.parse(payload);

    // Strict URL Validation
    const isValidUrl = (url: string) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    };

    if (validatedData.type === "link") {
      if (!validatedData.content.url || !isValidUrl(validatedData.content.url)) {
        return NextResponse.json({ error: "Invalid destination URL" }, { status: 400 });
      }
    } else if (validatedData.type === "image") {
      if (!validatedData.content.url || !isValidUrl(validatedData.content.url)) {
        return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
      }
    } else if (validatedData.type === "multi") {
      const actions = validatedData.content.actions || [];
      for (const action of actions) {
        if (!action.value || !isValidUrl(action.value)) {
          return NextResponse.json({ error: `Invalid URL for ${action.label || 'Action'}` }, { status: 400 });
        }
      }
    }

    // If free plan, remove logo if any provided (Currently allowing for all)
    // if (user.plan === "free" && validatedData.design.logoUrl) {
    //   validatedData.design.logoUrl = undefined;
    // }

    const uniqueId = generateId();

    const newQR = await QRCode.create({
      userId: user._id,
      uniqueId,
      name: validatedData.name,
      type: validatedData.type,
      content: validatedData.content,
      design: validatedData.design,
    });

    user.qrCount += 1;
    await user.save();

    return NextResponse.json({ success: true, qrCode: newQR }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Create QR error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
