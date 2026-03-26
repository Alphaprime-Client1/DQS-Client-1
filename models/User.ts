import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  image?: string;
  plan: "free" | "pro";
  qrCount: number;
  createdAt: Date;
}

const UserSchema = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    qrCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
