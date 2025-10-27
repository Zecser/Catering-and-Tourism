import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  type: "catering" | "tourism";
  image: {
    url: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    type: {
      type: String,
      enum: ["catering", "tourism"],
      required: true,
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBanner>("Banner", BannerSchema);
