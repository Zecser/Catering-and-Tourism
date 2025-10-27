import { Request, Response, RequestHandler } from "express";
import Blog from "../models/blog.model";
import cloudinary from "../config/cloudinary";

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

// 👇 Explicitly type each controller as RequestHandler
// Create a new blog
export const createBlog: RequestHandler = async (req, res) => {
  try {
    const { title, description, content, category } = req.body; // ADD category
    const finalDescription = description || content;

    if (!title || !finalDescription) {
      res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
      return;
    }

    // ADD CATEGORY VALIDATION
    if (!category) {
      res.status(400).json({
        success: false,
        message: "Category is required",
      });
      return;
    }

    if (!["Tourism", "Catering"].includes(category)) {
      res.status(400).json({
        success: false,
        message: "Category must be either Tourism or Catering",
      });
      return;
    }

    const images = (req.files as MulterFile[] | undefined)?.map((file) =>
      fileToImageObj(file)
    ) || [];

    const blog = await Blog.create({
      title,
      description: finalDescription,
      category, // ADD THIS
      images,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};



export const getBlogs: RequestHandler = async (req, res) => {
  try {
    const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt((req.query.limit as string) || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [total, blogs] = await Promise.all([
      Blog.countDocuments({}),
      Blog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({ success: true, data: blogs, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body; // ADD category

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    const files = (req.files as MulterFile[]) || [];

    // Determine which existing images to keep (if provided)
    const existing = ((blog as any).images || []) as { url: string; public_id: string }[];
    let keepPublicIds: string[] | undefined;
    if (typeof (req.body as any).keepImages === "string") {
      try {
        keepPublicIds = JSON.parse((req.body as any).keepImages);
      } catch {
        keepPublicIds = undefined;
      }
    }

    if (files.length || (keepPublicIds && Array.isArray(keepPublicIds))) {
      const imagesToKeep = keepPublicIds && Array.isArray(keepPublicIds)
        ? existing.filter((img) => keepPublicIds!.includes(img.public_id))
        : existing;

      const newImages = files
        .map((f) => fileToImageObj(f))
        .filter(Boolean) as { url: string; public_id: string }[];

      // Delete removed images from Cloudinary when keep list provided
      if (keepPublicIds && Array.isArray(keepPublicIds)) {
        const removed = existing.filter((img) => !keepPublicIds!.includes(img.public_id));
        await Promise.all(
          removed.map((img) => (img?.public_id ? cloudinary.uploader.destroy(img.public_id).catch(() => {}) : Promise.resolve()))
        );
      }

      (blog as any).images = [...imagesToKeep, ...newImages];
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (category) { // ADD THIS
      if (!["Tourism", "Catering"].includes(category)) {
        res.status(400).json({
          success: false,
          message: "Category must be either Tourism or Catering",
        });
        return;
      }
      blog.category = category;
    }

    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }

    const existing = (blog as any).images as { public_id?: string }[] | undefined;
    if (existing && Array.isArray(existing)) {
      await Promise.all(
        existing.map((img) => (img?.public_id ? cloudinary.uploader.destroy(img.public_id).catch(() => {}) : Promise.resolve()))
      );
    }

    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
