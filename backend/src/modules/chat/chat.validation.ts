import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(4000),
});

export const chatSchema = z.union([
  z.object({
    message: z.string().trim().min(1).max(4000),
  }),
  z.object({
    messages: z.array(messageSchema).min(1).max(50),
  }),
]);

export type ChatInput = z.infer<typeof chatSchema>;
