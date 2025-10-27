
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'images',
    resource_type: 'image',
    format: 'webp', // Auto convert to webp
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  }),
});

export const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});


const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'resumes',
    resource_type: 'raw',
    public_id: `${Date.now()}-${file.originalname}`,
    type: 'upload', 
  }),
});


// File filter to allow only PDFs
const pdfFileFilter = (_req: any, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

export const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
});