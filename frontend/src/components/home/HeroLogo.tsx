import { useState } from "react";

/** Big logo: public/logo-hero.png */
export function HeroLogo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="font-display text-[clamp(5rem,16vw,10rem)] font-extrabold leading-none tracking-tighter text-neutral-900">ITC</span>;
  }
  return (
    <img
      src="/logo-hero.png"
      alt="IT Community"
      onError={() => setFailed(true)}
      className="max-h-full max-w-full object-contain"
    />
  );
}
