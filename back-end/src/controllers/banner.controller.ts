import { Request, Response } from "express";
import Banner, { IBanner } from "../models/banner.model";
import { isValidObjectId } from "mongoose";

type MulterFile = Express.Multer.File & {
  path?: string;
  filename?: string;
  public_id?: string;
  secure_url?: string;
};

const fileToImageObj = (file?: MulterFile) => {
  if (!file) return undefined;
  return {
    url: (file.path || file.secure_url || "") as string,
    public_id: (file.filename || file.public_id || "") as string,
  };
};

//  Upload new banner
export const uploadBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.body;

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    if (!type || !["catering", "tourism"].includes(type)) {
      res.status(400).json({ error: "Invalid type" });
      return;
    }

    const image = fileToImageObj(req.file);
    if (!image) {
      res.status(400).json({ error: "Invalid image file" });
      return;
    }

    const banner = await Banner.create({ type, image });

    res.status(201).json({
      message: `${type} banner uploaded successfully`,
      data: banner,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

//  Update banner by ID
export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid banner ID" });
      return;
    }

    const { type } = req.body;
    const updateData: Partial<IBanner> = {};

    if (type && ["catering", "tourism"].includes(type)) {
      updateData.type = type as any;
    }

    if (req.file) {
      updateData.image = fileToImageObj(req.file) as any;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBanner) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }

    res.json({
      message: "Banner updated successfully",
      data: updatedBanner,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

//  Delete banner by ID
export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ error: "Invalid banner ID" });
      return;
    }

    const deletedBanner = await Banner.findByIdAndDelete(id);
    if (!deletedBanner) {
      res.status(404).json({ error: "Banner not found" });
      return;
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};


// List all banners
export const listBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use exec() to get a real promise and improve stack traces
    const banners = await Banner.find().sort({ createdAt: -1 }).lean().exec();

    // Always return success with array (empty array if none)
    console.log("Fetched banners:", banners);

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (err) {
    // Log full error for debugging
    console.error("listBanners Error:", err instanceof Error ? err.stack || err.message : err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch banners",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

