import type { ReactNode } from "react";
import { Logo } from "./Logo";

/** Split layout for login / register: red panel left, form right. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid h-full overflow-y-auto md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-accent p-10 text-on-accent md:flex">
        <div className="w-fit rounded-md bg-white px-4 py-3 text-neutral-900"><Logo /></div>
        <p className="font-display text-4xl font-extrabold leading-tight tracking-tight">
          Events, people and an assistant that knows the club.
        </p>
      </aside>

      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm animate-rise">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
          <p className="mb-8 mt-2 text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
