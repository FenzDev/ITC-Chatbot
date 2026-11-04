export type Event = {
  id: string;
  title: string;
  startsAt?: string; // ISO date string
  location?: string;
  description?: string;
};
