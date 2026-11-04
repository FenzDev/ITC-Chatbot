import { useEvents } from "../hooks";
import { EventRow } from "./EventRow";

export function EventsSection() {
  const { data, isPending, isError, refetch } = useEvents();

  return (
    <section id="events" className="wrap py-16 sm:py-20">
      <div className="flex items-end justify-between border-b-2 border-ink pb-4">
        <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Upcoming events</h2>
        {data && data.length > 0 && <p className="text-sm font-bold text-muted">{data.length} total</p>}
      </div>

      {isPending && (
        <div className="mt-2 divide-y divide-line" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="my-6 h-20 animate-pulse bg-surface" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-8 border-2 border-dashed border-line p-8">
          <p className="font-display text-xl font-bold">Couldn't load events.</p>
          <p className="mt-1 text-muted">Check that the API is running and try again.</p>
          <button onClick={() => refetch()} className="btn btn-ghost mt-5">Try again</button>
        </div>
      )}

      {data && data.length === 0 && (
        <p className="mt-8 text-lg text-muted">Nothing scheduled right now. Check back soon.</p>
      )}

      {data && data.length > 0 && (
        <ul className="divide-y divide-line">
          {data.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </ul>
      )}
    </section>
  );
}
