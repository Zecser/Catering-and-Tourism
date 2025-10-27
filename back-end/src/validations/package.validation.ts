import { z } from 'zod';

export const PackageZodSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),

  price: z
    .number()
    .int('Price must be an integer')
    .min(1, 'Price must be at least $1'),

  features: z
    .array(
      z
        .string()
        .min(1, 'Feature cannot be empty')
        .max(100, 'Feature must not exceed 100 characters')
    )
    .min(1, 'At least one feature is required')
    .max(20, 'You can include a maximum of 20 features'),
});


export const applyFormValidation = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Phone must be at least 8 digits"),
  whatsapp: z.string().min(8, "WhatsApp number must be at least 8 digits"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(2, "Location is required"),
});

