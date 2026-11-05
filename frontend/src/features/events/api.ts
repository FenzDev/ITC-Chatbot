import { api } from "@/lib/api-client";
import type { CreateEventInput, Event } from "./types";

type EventApiResponse = Omit<Event, "id"> & {
  _id?: string;
  id?: string;
  date?: string;
};

function normalizeEvent(event: EventApiResponse): Event {
  return {
    ...event,
    id: event.id ?? event["_id"] ?? "",
    startsAt: event.startsAt ?? event.date,
  };
}

export async function getEvents() {
  const events = await api<EventApiResponse[]>("/events");
  return events.map(normalizeEvent);
}

export async function getEvent(id: string) {
  const event = await api<EventApiResponse>(`/events/${id}`);
  return normalizeEvent(event);
}
export const registerForEvent = (id: string) =>
  api<void>(`/events/${id}/register`, { method: "POST" });
export const createEvent = (input: CreateEventInput) =>
  api<EventApiResponse>("/events", { method: "POST", body: input }).then(normalizeEvent);
