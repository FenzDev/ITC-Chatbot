import { Hero } from "@/components/home/Hero";
import { AssistantBand } from "@/components/home/AssistantBand";
import { EventsSection } from "@/features/events/components/EventsSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <EventsSection />
      <AssistantBand />
    </>
  );
}
