import { Event } from './event.model.js';
import type { CreateEventInput } from './event.validation.js';

export async function createEvent(data: CreateEventInput) {
  const event = await Event.create(data);

  return event;
}

export async function getAllEvents() {
  return Event.find().select('-registeredUsers').sort({ date: 1 });
}

export async function getEventById(id: string) {
  return Event.findById(id).select('-registeredUsers');
}

export async function registerForEvent(eventId: string, userId: string) {
  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      status: { $in: ['upcoming', 'ongoing'] },
      registrationDeadline: { $gte: new Date() },
      registeredUsers: { $ne: userId },
      $expr: {
        $lt: [
          { $size: { $ifNull: ['$registeredUsers', []] } },
          '$capacity',
        ],
      },
    },
    { $addToSet: { registeredUsers: userId } },
    { new: true },
  );

  if (event) return event;

  const existingEvent = await Event.findById(eventId).select(
    'status registrationDeadline registeredUsers capacity',
  );
  if (!existingEvent) throw new Error('EVENT_NOT_FOUND');
  const registeredUsers = existingEvent.registeredUsers ?? [];
  if (registeredUsers.some((id) => id.toString() === userId)) {
    throw new Error('ALREADY_REGISTERED');
  }
  if (registeredUsers.length >= existingEvent.capacity) {
    throw new Error('EVENT_FULL');
  }
  throw new Error('REGISTRATION_CLOSED');
}

export async function getAssistantEvents() {
  return Event.find({
    date: { $gte: new Date() },
    status: { $in: ['upcoming', 'ongoing'] },
  })
    .sort({ date: 1 })
    .limit(20)
    .select('title description location date capacity registrationDeadline status')
    .lean();
}
