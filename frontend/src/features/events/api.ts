import { api } from '@/lib/api-client';
import type { Event } from './types';

export const getEvents = () => api<Event[]>('/events');
export const getEvent = (id: string) => api<Event>(`/events/${id}`);
export const registerForEvent = (id: string) =>
  api<void>(`/events/${id}/register`, { method: 'POST' });
