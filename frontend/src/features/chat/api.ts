import { api, ApiError } from "@/lib/api-client";
import type { ChatMessage } from "./types";

export const getChatHistory = () => api<ChatMessage[]>("/chat/history");

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}/api/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }
  if (!response.body) throw new Error("Chat stream is unavailable");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let reply = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const line = event.split("\n").find((item) => item.startsWith("data:"));
        if (!line) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        const chunk = JSON.parse(data) as { content?: string };
        if (chunk.content) reply += chunk.content;
      }
    }
  } finally {
    reader.releaseLock();
  }

  return reply;
}
