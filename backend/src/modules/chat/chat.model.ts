import { Schema, Types, model, type Document } from 'mongoose';

export type ChatRole = 'user' | 'assistant';

export interface IChatMessage {
  role: ChatRole;
  content: string;
  createdAt: Date;
}

export interface IChatConversation extends Document {
  user: Types.ObjectId;
  messages: IChatMessage[];
}

const messageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, trim: true },
  },
  { _id: false, timestamps: true },
);

const conversationSchema = new Schema<IChatConversation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

export const ChatConversation = model<IChatConversation>(
  'ChatConversation',
  conversationSchema,
);
