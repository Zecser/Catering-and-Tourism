import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import Image from '../models/gallery.model';

const isValidTitle = (title: string) => typeof title === 'string' && title.trim().length > 0;

// -------------------- CREATE IMAGE --------------------
export const createImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, status } = req.body;

    if (!isValidTitle(title)) {
      res.status(400).json({ error: 'Title is required and cannot be empty' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const normalizedStatus = status && (status === 'active' || status === 'inactive') ? status : 'active';

    const image = new Image({
      title: title.trim(),
      url: req.file.path,
      public_id: req.file.filename,
      status: normalizedStatus,
    });

    await image.save();
    res.status(201).json(image);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET PAGINATED IMAGES --------------------
export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) ||100;
    const titleFilter = req.query.title as string | undefined;
    const statusFilter = req.query.status as string | undefined;

    const query: any = {};
    if (titleFilter) query.title = titleFilter;
    if (statusFilter) query.status = statusFilter;

    const total = await Image.countDocuments(query);

    const images = await Image.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      images,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPDATE IMAGE --------------------
export const updateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const image = await Image.findById(id);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    if (status && (status === 'active' || status === 'inactive')) {
      image.status = status;
    }

    if (title) {
      if (!isValidTitle(title)) {
        res.status(400).json({ error: 'Title cannot be empty' });
        return;
      }
      image.title = title.trim();
    }

    if (req.file) {
      await cloudinary.uploader.destroy(image.public_id);
      image.url = req.file.path;
      image.public_id = req.file.filename;
    }

    await image.save();
    res.status(200).json(image);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE IMAGE --------------------
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }

    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
