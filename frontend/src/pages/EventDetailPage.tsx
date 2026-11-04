import { useParams } from "react-router";
import { useEvent, useRegister } from "@/features/events/hooks";

export function EventDetailPage() {
  const { eventId = "" } = useParams();
  const { data, isPending, error } = useEvent(eventId);
  const register = useRegister(eventId);

  if (isPending) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Event not found.</p>;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">{data.title}</h1>
      <button
        onClick={() => register.mutate()}
        disabled={register.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        Register
      </button>
    </>
  );
}
