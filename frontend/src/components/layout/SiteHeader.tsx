import { Link } from "react-router";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useGetUser } from "@/features/auth/hooks";

const link = "hidden px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink sm:block";

export function SiteHeader() {
  const { data: user } = useGetUser();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-page">
      <nav aria-label="Main" className="wrap flex h-16 items-center gap-1">
        <Link to="/" className="mr-auto" aria-label="ITC Hub home">
          <Logo />
        </Link>

        <a href="/#events" className={link}>Events</a>
        <Link to="/chat" className={link}>Assistant</Link>

        {user ? (
          <span className="hidden max-w-44 truncate px-3 text-sm font-semibold sm:block" title={user.email}>
            {user.name || user.email}
          </span>
        ) : (
          <>
            <Link to="/login" className={link}>Log in</Link>
            <Link to="/register" className="btn btn-primary ml-2">Join</Link>
          </>
        )}
        <span className="ml-2"><ThemeToggle /></span>
      </nav>
    </header>
  );
}
