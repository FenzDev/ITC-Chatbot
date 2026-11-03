import { Schema, model, type Document } from 'mongoose';

export type UserRole = 'member' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
