import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvent, getEvent, getEvents, registerForEvent } from "./api";
import type { CreateEventInput } from "./types";

export const eventKeys = {
  all: ["events"] as const,
  detail: (id: string) => ["events", id] as const,
};

export const useEvents = () => useQuery({ queryKey: eventKeys.all, queryFn: getEvents });

export const useEvent = (id: string) =>
  useQuery({ queryKey: eventKeys.detail(id), queryFn: () => getEvent(id) });

export function useRegister(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => registerForEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.detail(id) }),
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}
