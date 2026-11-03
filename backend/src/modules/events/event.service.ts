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
