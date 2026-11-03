import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3).max(100),

  description: z.string().min(10),

  location: z.string().min(2),

  date: z.coerce.date(),

  image: z.string().url().optional(),

  capacity: z.number().int().positive(),

  registrationDeadline: z.coerce.date()
});

export type CreateEventInput = z.infer<typeof createEventSchema>;