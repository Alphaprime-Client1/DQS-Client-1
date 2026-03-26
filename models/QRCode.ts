import mongoose, { Schema, Document } from "mongoose";

export interface IQRCode extends Document {
  userId: mongoose.Types.ObjectId;
  uniqueId: string;
  name: string;
  type: "link" | "text" | "image" | "multi";
  content: any;
  design: {
    size: number;
    fgColor: string;
    bgColor: string;
    logoUrl?: string;
    logoSize?: number;
    dotStyle?: string;
    cornerStyle?: string;
    cornerColor?: string;
    frameStyle?: string;
    gradientConfig?: any;
  };
  scanCount: number;
  isActive: boolean;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uniqueId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["link", "text", "image", "multi"], required: true },
    content: { type: Schema.Types.Mixed, required: true },
    design: {
      size: { type: Number, default: 300 },
      fgColor: { type: String, default: "#000000" },
      bgColor: { type: String, default: "#ffffff" },
      logoUrl: { type: String },
      logoSize: { type: Number, default: 0.25 },
      dotStyle: { type: String, default: "square" },
      cornerStyle: { type: String, default: "square" },
      cornerColor: { type: String },
      frameStyle: { type: String, default: "none" },
      gradientConfig: { type: Schema.Types.Mixed },
    },
    scanCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const QRCode = mongoose.models.QRCode || mongoose.model<IQRCode>("QRCode", QRCodeSchema);
