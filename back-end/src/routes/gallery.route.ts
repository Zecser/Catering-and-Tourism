import { Router } from 'express';
import {
  createImage,
  getImages,
  updateImage,
  deleteImage,
} from '../controllers/gallery.controller';
import { imageUpload } from '../middlewares/cloudinary.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', imageUpload.single('image'), createImage);
router.get('/', getImages);
router.put('/:id', authMiddleware, imageUpload.single('image'), updateImage);
router.delete('/:id', authMiddleware, deleteImage);

export default router;
