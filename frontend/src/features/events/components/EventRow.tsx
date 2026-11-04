import { useNavigate } from "react-router";
import { ApiError, getErrorMessage } from "@/lib/api-client";
import { useRegister } from "../hooks";
import { formatEventDate } from "../format";
import type { Event } from "../types";

export function EventRow({ event }: { event: Event }) {
  const navigate = useNavigate();
  const register = useRegister(event.id);
  const date = formatEventDate(event.startsAt);

  function onRegister() {
    register.mutate(undefined, {
      // not logged in -> open the login sheet
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) navigate("/login");
      },
    });
  }

  const meta = [date?.time, event.location].filter(Boolean).join(" · ");

  return (
    <li className="grid gap-4 py-6 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-8">
      <div className="flex size-20 flex-col items-center justify-center bg-accent text-on-accent">
        <span className="text-xs font-bold tracking-wider">{date?.month ?? "TBA"}</span>
        <span className="font-display text-3xl font-extrabold leading-none">{date?.day ?? "–"}</span>
      </div>

      <div>
        <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl">{event.title}</h3>
        {meta && <p className="mt-1 text-sm font-semibold text-muted">{meta}</p>}
        {event.description && <p className="mt-2 line-clamp-2 max-w-2xl text-muted">{event.description}</p>}
      </div>

      <div className="sm:text-right">
        <button onClick={onRegister} disabled={register.isPending || register.isSuccess} className="btn btn-primary w-full sm:w-auto">
          {register.isSuccess ? "Registered ✓" : register.isPending ? "Registering…" : "Register"}
        </button>
        {register.isError && !(register.error instanceof ApiError && register.error.status === 401) && (
          <p role="alert" className="mt-2 text-sm text-accent">{getErrorMessage(register.error)}</p>
        )}
      </div>
    </li>
  );
}
