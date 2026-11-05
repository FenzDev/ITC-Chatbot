import { useState } from "react";
import { Navigate } from "react-router";
import { Overlay } from "@/components/ui/Overlay";
import { Field } from "@/components/ui/Field";
import { useGetUser } from "@/features/auth/hooks";
import { useCreateEvent } from "@/features/events/hooks";
import { useAssistantContext, useUpdateAssistantContext } from "@/features/chat/hooks";
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
  const assistantContext = useAssistantContext(Boolean(user && user.role === "admin"));
  const updateAssistantContext = useUpdateAssistantContext();
  const [form, setForm] = useState(initialForm);
  const [context, setContext] = useState("");

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

  function saveContext(e: React.FormEvent) {
    e.preventDefault();
    updateAssistantContext.mutate({ content: context });
  }

  const contextValue = context || assistantContext.data?.content || "";

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

        <section className="mt-14 border-t-2 border-ink pt-8">
          <p className="eyebrow mb-3">Assistant configuration</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight">Give the assistant context</h2>
          <p className="mt-2 text-muted">
            These instructions are sent as the assistant&apos;s private system context for every member conversation.
          </p>
          <form onSubmit={saveContext} className="mt-5 space-y-4">
            <div>
              <label htmlFor="assistant-context" className="mb-1.5 block text-sm font-bold">Assistant instructions</label>
              <textarea
                id="assistant-context"
                required
                maxLength={10000}
                value={contextValue}
                onChange={(e) => setContext(e.target.value)}
                className="field min-h-56 resize-y"
                placeholder="Describe the club, tone, rules, and information the assistant should use."
              />
              <p className="mt-1 text-right text-xs text-muted">{contextValue.length}/10000</p>
            </div>
            {assistantContext.isError && <p role="alert" className="text-sm text-accent">Couldn&apos;t load assistant context.</p>}
            {updateAssistantContext.isError && <p role="alert" className="text-sm text-accent">{getErrorMessage(updateAssistantContext.error, "Couldn&apos;t save assistant context.")}</p>}
            {updateAssistantContext.isSuccess && <output className="text-sm font-bold text-accent">Assistant context saved.</output>}
            <button type="submit" disabled={updateAssistantContext.isPending || assistantContext.isPending} className="btn btn-primary">
              {updateAssistantContext.isPending ? "Saving…" : "Save assistant context"}
            </button>
          </form>
        </section>
      </div>
    </Overlay>
  );
}
