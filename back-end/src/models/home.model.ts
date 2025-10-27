import mongoose, { Schema, Document } from "mongoose";

export interface IHomeBanner extends Document {
  type: "hero" | "catering" | "tourism";
  imageUrl: string;
  createdAt: Date;
}

const HomeBannerSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["hero", "catering", "tourism"],
    required: true,
  },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const HomeBanner = mongoose.model<IHomeBanner>("HomeBanner", HomeBannerSchema);
