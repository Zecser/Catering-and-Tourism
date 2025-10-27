import { Request, Response } from "express";
import { HomeBanner } from "../models/home.model";
import cloudinary from "../config/cloudinary";

// Upload hero banner
export const uploadHeroBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // multer-storage-cloudinary gives Cloudinary info inside req.file
    const cloudinaryFile = req.file as any; 
    const imageUrl = cloudinaryFile.path;   

    await HomeBanner.create({
      type: "hero",
      imageUrl,
    });

    res.status(201).json({ 
      message: "Hero banner uploaded successfully", 
      url: imageUrl 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};


// Upload catering/tourism banner
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

    const cloudinaryFile = req.file as any;
    const imageUrl = cloudinaryFile.path;

    await HomeBanner.create({
      type,
      imageUrl,
    });

    res.status(201).json({ 
      message: `${type} banner uploaded successfully`, 
      url: imageUrl 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};


// Get banners by type
export const getBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query as { type?: string };

    const query: Record<string, any> = {};
    if (type) {
      query.type = type;
    }

    // Fetch banners (newest first)
    const banners = await HomeBanner.find(query)
      .sort({ createdAt: -1 })
      .select("type imageUrl createdAt"); 

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: "Server error", 
      details: err instanceof Error ? err.message : err 
    });
  }
};

// Update banner
export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const banner = await HomeBanner.findById(id);
    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    // Validate type if provided
    if (type && !["hero", "catering", "tourism"].includes(type)) {
      res.status(400).json({ message: "Invalid type" });
      return;
    }

    let imageUrl = banner.imageUrl;

    // If a new file is uploaded, replace the image
    if (req.file) {
      const cloudinaryFile = req.file as any;

      // Optional: delete old image from Cloudinary if you saved public_id
      if ((banner as any).publicId) {
        await cloudinary.uploader.destroy((banner as any).publicId);
      }

      imageUrl = cloudinaryFile.path;
    }

    // Update banner
    banner.type = type || banner.type;
    banner.imageUrl = imageUrl;

    await banner.save();

    res.status(200).json({
      message: "Banner updated successfully",
      banner,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err });
  }
};

// Delete banner
export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const banner = await HomeBanner.findById(id);
    if (!banner) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    // Optional: delete image from Cloudinary if you saved public_id
    if ((banner as any).publicId) {
      await cloudinary.uploader.destroy((banner as any).publicId);
    }

    await banner.deleteOne();

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err });
  }
};