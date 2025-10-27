import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  heading: z.string().min(3, "Heading must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z
    .any()
    .optional(), 
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
