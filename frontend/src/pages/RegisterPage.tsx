import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterUser } from "@/features/auth/hooks";
import type { RegisterInput } from "@/features/auth/types";

const field = "w-full rounded border border-slate-300 px-3 py-2";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegisterUser();
  const [form, setForm] = useState<RegisterInput>({ name: "", email: "", password: "" });

  const set = (key: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate(form, {
      // TODO: store the returned token (context/localStorage) once auth is decided
      onSuccess: () => navigate("/"),
    });
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className={field} placeholder="Name" value={form.name} onChange={set("name")} required />
        <input className={field} type="email" placeholder="Email" value={form.email} onChange={set("email")} required />
        <input className={field} type="password" placeholder="Password" minLength={8} value={form.password} onChange={set("password")} required />
        {register.isError && <p className="text-red-600">Registration failed.</p>}
        <button
          disabled={register.isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {register.isPending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already a member? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
