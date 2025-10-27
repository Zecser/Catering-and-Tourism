import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  title: string;
  url: string;
  public_id: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'] },
  },
  { timestamps: true }
);

export default mongoose.model<IImage>('Image', imageSchema);
