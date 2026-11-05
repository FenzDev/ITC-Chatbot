import { useState } from "react";
import { useNavigate } from "react-router";
import { ApiError, getErrorMessage } from "@/lib/api-client";
import { useRegister } from "../hooks";
import { formatEventDate } from "../format";
import type { Event } from "../types";

export function EventRow({ event }: { event: Event }) {
  const navigate = useNavigate();
  const register = useRegister(event.id);
  const [confirming, setConfirming] = useState(false);
  const date = formatEventDate(event.startsAt);

  function onRegister() {
    setConfirming(false);
    register.mutate(undefined, {
      // not logged in -> open the login sheet
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) navigate("/login");
      },
    });
  }

  const meta = [date?.time, event.location].filter(Boolean).join(" · ");

  return (
    <li className="grid gap-4 py-6 sm:grid-cols-[5rem_8rem_1fr_auto] sm:items-center sm:gap-8">
      <div className="flex size-20 flex-col items-center justify-center bg-accent text-on-accent">
        <span className="text-xs font-bold tracking-wider">{date?.month ?? "TBA"}</span>
        <span className="font-display text-3xl font-extrabold leading-none">{date?.day ?? "–"}</span>
      </div>

      {event.image ? (
        <img
          src={event.image}
          alt=""
          loading="lazy"
          className="h-24 w-full rounded-md border-2 border-line object-cover sm:h-20"
        />
      ) : (
        <div aria-hidden="true" className="hidden h-20 rounded-md border-2 border-dashed border-line sm:block" />
      )}

      <div>
        <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">{event.title}</h3>
        {meta && <p className="mt-1 text-sm font-semibold text-muted">{meta}</p>}
        {event.description && <p className="mt-2 line-clamp-2 max-w-2xl text-muted">{event.description}</p>}
      </div>

      <div className="sm:text-right">
        <button onClick={() => setConfirming(true)} disabled={register.isPending || register.isSuccess} className="btn btn-primary w-full sm:w-auto">
          {register.isSuccess ? "Registered ✓" : register.isPending ? "Registering…" : "Register"}
        </button>
        {register.isError && !(register.error instanceof ApiError && register.error.status === 401) && (
          <p role="alert" className="mt-2 text-sm text-accent">{getErrorMessage(register.error)}</p>
        )}
      </div>

      {confirming && (
        <dialog open aria-labelledby={`register-title-${event.id}`} className="fixed inset-0 z-50 m-0 flex size-full max-w-none items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md border-2 border-ink bg-page p-6 shadow-xl">
            <h2 id={`register-title-${event.id}`} className="font-display text-2xl font-extrabold">
              Register for this event?
            </h2>
            <p className="mt-2 text-muted">
              You&apos;re registering for <strong className="text-ink">{event.title}</strong>.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button type="button" onClick={onRegister} className="btn btn-primary">
                Confirm registration
              </button>
            </div>
          </div>
        </dialog>
      )}
    </li>
  );
}
