import { Link } from "react-router";
import { HeroLogo } from "./HeroLogo";

export function Hero() {
  return (
    <section id="top" className="border-b-2 border-ink">
      <div className="wrap grid gap-14 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-20">
        <div className="animate-rise">
          <p className="eyebrow mb-4">IT Community</p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl text-balance">
            SHARING IS CARING
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Browse upcoming events, register in a couple of clicks, or ask the assistant if you're not sure where to start.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#events" className="btn btn-primary">See events</a>
            <Link to="/chat" className="btn btn-ghost">Ask the assistant</Link>
          </div>
        </div>

        {/* flat logo panel with an offset red block behind it */}
        <div className="relative animate-rise [animation-delay:120ms]">
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-accent sm:translate-x-4 sm:translate-y-4" aria-hidden />
          <div className="relative flex aspect-[4/3] items-center justify-center border-2 border-ink bg-black p-8 sm:p-14">
            <HeroLogo />
          </div>
        </div>
      </div>
    </section>
  );
}
