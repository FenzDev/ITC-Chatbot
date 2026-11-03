import mongoose, { Schema, type Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  image?: string;
  capacity: number;
  registrationDeadline: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    image: {
      type: String
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    registrationDeadline: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    }
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);