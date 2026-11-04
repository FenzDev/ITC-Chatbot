import { Link } from "react-router";

export function AssistantBand() {
  return (
    <section className="bg-accent text-on-accent">
      <div className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Not sure where to start?</h2>
          <p className="mt-2 max-w-md opacity-90">Ask the club assistant about events, teams or how to join.</p>
        </div>
        <Link to="/chat" className="btn btn-light">Open the assistant</Link>
      </div>
    </section>
  );
}
