import { z } from "zod";

export type User = z.infer<typeof userSchema>;
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  memoryLaneDescription: z.string(),
});

export type Memory = z.infer<typeof memorySchema>;
export const memorySchema = z.object({
  id: z.string().nanoid(),
  name: z.string(),
  description: z.string(),
  timestampISO: z.string().datetime({ local: true }),
  images: z.string().url().array().nonempty(),
});
