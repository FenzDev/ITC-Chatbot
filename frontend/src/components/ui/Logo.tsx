import { useState } from "react";

/**
 * Header / footer logo.
 *   public/logo.png       used in light mode (and dark mode if no dark file)
 *   public/logo-dark.png  optional, used in dark mode
 * Falls back to a text wordmark when logo.png is missing.
 */
export function Logo({ className = "h-9" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const [darkMissing, setDarkMissing] = useState(false);

  if (failed) {
    return <span className="font-display text-2xl font-extrabold tracking-tight">ITC<span className="text-accent">.</span></span>;
  }
  return (
    <>
      <img
        src="/logo.png"
        alt="ITC"
        onError={() => setFailed(true)}
        className={`${className} w-auto ${darkMissing ? "" : "dark:hidden"}`}
      />
      {!darkMissing && (
        <img
          src="/logo-dark.png"
          alt="ITC"
          onError={() => setDarkMissing(true)}
          className={`${className} hidden w-auto dark:block`}
        />
      )}
    </>
  );
}
