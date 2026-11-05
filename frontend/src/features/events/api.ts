import { api } from "@/lib/api-client";
import type { CreateEventInput, Event } from "./types";

export const getEvents = () => api<Event[]>("/events");
export const getEvent = (id: string) => api<Event>(`/events/${id}`);
export const registerForEvent = (id: string) =>
  api<void>(`/events/${id}/register`, { method: "POST" });
export const createEvent = (input: CreateEventInput) =>
  api<Event>("/events", { method: "POST", body: input });
