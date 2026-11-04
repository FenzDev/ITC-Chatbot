import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router";

/**
 * Near-fullscreen sheet over the home page. Side + top gaps keep the page
 * visible behind it. Closing = navigating back to "/".
 */
export function Overlay({ label, children }: { label: string; children: ReactNode }) {
  const navigate = useNavigate();
  const panel = useRef<HTMLDivElement>(null);
  const close = () => navigate("/");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && navigate("/");
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [navigate]);

  return (
    <dialog open aria-label={label} className="fixed inset-0 z-50 m-0 size-full max-h-none max-w-none bg-transparent p-0 text-ink">
      <button
        aria-label="Close"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default animate-fade bg-black/40"
      />
      <div
        ref={panel}
        tabIndex={-1}
        className="absolute inset-x-[clamp(0.5rem,5vw,5rem)] bottom-0 top-[clamp(0.75rem,5vh,3.5rem)] flex animate-sheet flex-col overflow-hidden rounded-t-lg border-2 border-b-0 border-ink bg-page outline-none"
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
          <p className="eyebrow">{label}</p>
          <button onClick={close} className="btn btn-ghost !px-3 !py-1.5 text-xs">
            Close <kbd className="text-[0.65rem] opacity-60">esc</kbd>
          </button>
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </dialog>
  );
}
