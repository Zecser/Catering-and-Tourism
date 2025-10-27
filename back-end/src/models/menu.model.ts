import mongoose, { Schema, Document } from "mongoose";

export interface IMenuCategory extends Document {
    name: string;
    items: string[];
}

const MenuCategorySchema = new Schema<IMenuCategory>({
    name: { type: String, required: true, unique: true },
    items: { type: [String], default: [] },
});

export default mongoose.model<IMenuCategory>("MenuCategory", MenuCategorySchema);
