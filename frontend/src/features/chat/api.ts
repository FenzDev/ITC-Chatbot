import { api } from "@/lib/api-client";
import type { ChatMessage, ChatReply } from "./types";

export const sendChat = (messages: ChatMessage[]) =>
  api<ChatReply>("/chat", { method: "POST", body: { messages } });
