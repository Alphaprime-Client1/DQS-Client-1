import mongoose, { Schema, Document } from "mongoose";

export interface IScanLog extends Document {
  qrId: mongoose.Types.ObjectId;
  timestamp: Date;
  userAgent?: string;
  country?: string;
}

const ScanLogSchema = new Schema(
  {
    qrId: { type: Schema.Types.ObjectId, ref: "QRCode", required: true },
    timestamp: { type: Date, default: Date.now },
    userAgent: { type: String },
    country: { type: String },
  },
  { timestamps: false }
);

export const ScanLog = mongoose.models.ScanLog || mongoose.model<IScanLog>("ScanLog", ScanLogSchema);
