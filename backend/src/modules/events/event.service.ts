import { Event } from './event.model.js';
import type { CreateEventInput } from './event.validation.js';

export async function createEvent(data: CreateEventInput) {
  const event = await Event.create(data);

  return event;
}

export async function getAllEvents() {
  return Event.find().sort({ date: 1 });
}

export async function getEventById(id: string) {
  return Event.findById(id);
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
