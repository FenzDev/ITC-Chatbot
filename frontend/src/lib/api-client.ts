import { env } from "@/lib/env";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

type Options = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T>(path: string, { body, headers, ...init }: Options = {}): Promise<T> {
  const res = await fetch(`${env.apiUrl}/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    // credentials: "include", // enable if the backend uses cookies (needs CORS credentials too)
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

/** Best-effort human message from a failed request. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Try again."): string {
  if (err instanceof ApiError && err.body && typeof err.body === "object" && "message" in err.body) {
    const m = (err.body as { message: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}
