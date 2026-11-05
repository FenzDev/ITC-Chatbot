import { useState } from "react";
import { Navigate } from "react-router";
import { Overlay } from "@/components/ui/Overlay";
import { Field } from "@/components/ui/Field";
import { useGetUser } from "@/features/auth/hooks";
import { useCreateEvent } from "@/features/events/hooks";
import { getErrorMessage } from "@/lib/api-client";

const initialForm = {
  title: "",
  description: "",
  location: "",
  date: "",
  image: "",
  capacity: "50",
  registrationDeadline: "",
};

export function AdminEventsPage() {
  const { data: user, isPending } = useGetUser();
  const createEvent = useCreateEvent();
  const [form, setForm] = useState(initialForm);

  if (isPending) {
    return <Overlay label="Admin events"><p className="p-5 text-muted">Checking access…</p></Overlay>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to={user ? "/" : "/login"} replace />;
  }

  function update(name: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    createEvent.mutate({
      ...form,
      image: form.image || undefined,
      capacity: Number(form.capacity),
      date: new Date(form.date).toISOString(),
      registrationDeadline: new Date(form.registrationDeadline).toISOString(),
    }, {
      onSuccess: () => setForm(initialForm),
    });
  }

  return (
    <Overlay label="Admin events">
      <div className="mx-auto h-full max-w-3xl overflow-y-auto px-5 py-8 sm:px-8">
        <div className="mb-8">
          <p className="eyebrow mb-3">Admin panel</p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Add an event
          </h1>
          <p className="mt-2 text-muted">Publish a new event for members to discover.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <Field label="Title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-bold">Description</label>
            <textarea id="description" required minLength={10} value={form.description}
              onChange={(e) => update("description", e.target.value)} className="field min-h-32 resize-y" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Location" required value={form.location} onChange={(e) => update("location", e.target.value)} />
            <Field label="Capacity" type="number" min="1" required value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />
            <Field label="Event date" type="datetime-local" required value={form.date} onChange={(e) => update("date", e.target.value)} />
            <Field label="Registration deadline" type="datetime-local" required value={form.registrationDeadline} onChange={(e) => update("registrationDeadline", e.target.value)} />
          </div>
          <Field label="Image URL (optional)" type="url" value={form.image} onChange={(e) => update("image", e.target.value)} />

          {createEvent.isError && <p role="alert" className="text-sm text-accent">{getErrorMessage(createEvent.error, "Couldn't create event.")}</p>}
          {createEvent.isSuccess && <output className="text-sm font-bold text-accent">Event created successfully.</output>}
          <button type="submit" disabled={createEvent.isPending} className="btn btn-primary">
            {createEvent.isPending ? "Publishing…" : "Publish event"}
          </button>
        </form>
      </div>
    </Overlay>
  );
}
