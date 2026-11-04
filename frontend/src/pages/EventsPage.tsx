import { Link } from "react-router";
import { useEvents } from "@/features/events/hooks";

export function EventsPage() {
  const { data, isPending, error } = useEvents();

  if (isPending) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load events.</p>;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Events</h1>
      <ul className="space-y-2">
        {data.map((e) => (
          <li key={e.id}>
            <Link to={`/events/${e.id}`} className="text-blue-600 hover:underline">
              {e.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
