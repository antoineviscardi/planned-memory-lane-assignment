import { z } from "zod";

export type Image = z.infer<typeof imageSchema>;
export const imageSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().regex(/^image\//, "File must be an image"),
  size: z.number(),
  buffer: z
    .instanceof(Buffer)
    .refine((buffer) => buffer.length > 0, "File cannot be empty")
    .refine(
      (buffer) => buffer.length <= 5 * 1024 * 1024,
      "File must be less than 5MB",
    ),
});
