import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Overlay } from "@/components/ui/Overlay";
import { AuthShell } from "@/components/ui/AuthShell";
import { Field } from "@/components/ui/Field";
import { useLoginUser } from "@/features/auth/hooks";
import { getErrorMessage } from "@/lib/api-client";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginUser();
  const [form, setForm] = useState({ email: "", password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate(form, { onSuccess: () => navigate("/") });
  }

  return (
    <Overlay label="Log in">
      <AuthShell title="Welcome back" subtitle="Log in to register for events.">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" type="email" required autoComplete="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field label="Password" type="password" required autoComplete="current-password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {login.isError && <p role="alert" className="text-sm text-accent">{getErrorMessage(login.error, "Login failed.")}</p>}
          <button disabled={login.isPending} className="btn btn-primary w-full">
            {login.isPending ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          New here? <Link to="/register" replace className="font-semibold text-accent hover:underline">Create an account</Link>
        </p>
      </AuthShell>
    </Overlay>
  );
}
