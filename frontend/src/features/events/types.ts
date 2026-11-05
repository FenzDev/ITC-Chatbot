export type Event = {
  id: string;
  title: string;
  startsAt?: string; // ISO date string
  location?: string;
  description?: string;
};

export type CreateEventInput = {
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
  capacity: number;
  registrationDeadline: string;
};
