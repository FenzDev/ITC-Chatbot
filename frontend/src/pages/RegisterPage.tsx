import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Overlay } from "@/components/ui/Overlay";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field } from "@/components/ui/Field";
import { useRegisterUser } from "@/features/auth/hooks";
import { getErrorMessage } from "@/lib/api-client";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegisterUser();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate(form, { onSuccess: () => navigate("/") });
  }

  return (
    <Overlay label="Join">
      <AuthShell title="Join the hub" subtitle="Create your member account.">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Name" required autoComplete="name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Field label="Email" type="email" required autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field label="Password" type="password" required minLength={8} autoComplete="new-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {register.isError && <p role="alert" className="text-sm text-accent">{getErrorMessage(register.error, "Registration failed.")}</p>}
          <button disabled={register.isPending} className="btn btn-primary w-full">
            {register.isPending ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Already a member? <Link to="/login" replace className="font-semibold text-accent hover:underline">Log in</Link>
        </p>
      </AuthShell>
    </Overlay>
  );
}
