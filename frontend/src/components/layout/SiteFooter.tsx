import { Link } from "react-router";
import { Logo } from "@/components/ui/Logo";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="wrap flex flex-wrap items-center justify-between gap-5 py-8">
        <Logo />
        <nav className="flex gap-6 text-sm font-semibold" aria-label="Footer">
          <a href="/#events" className="hover:text-accent">Events</a>
          <Link to="/chat" className="hover:text-accent">Assistant</Link>
          <Link to="/register" className="hover:text-accent">Join</Link>
        </nav>
        <p className="text-sm text-muted">© {YEAR} IT Community</p>
      </div>
    </footer>
  );
}
