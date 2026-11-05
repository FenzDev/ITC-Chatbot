import { useState } from "react";
import { Overlay } from "@/components/ui/Overlay";
import { useSendChat } from "@/features/chat/hooks";
import { useChatHistory } from "@/features/chat/hooks";
import { useGetUser } from "@/features/auth/hooks";
import type { ChatMessage } from "@/features/chat/types";

const suggestions = ["What events are coming up?", "How do I join the club?", "What can you help with?"];

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chat = useSendChat();
  const { data: user } = useGetUser();
  const history = useChatHistory(Boolean(user));

  if (history.isPending) {
    return <Overlay label="Assistant"><p className="p-5 text-muted">Loading conversation…</p></Overlay>;
  }

  const displayedMessages = messages.length > 0 ? messages : (history.data ?? []);

  function send(text: string) {
    if (!text.trim() || chat.isPending) return;
    const next: ChatMessage[] = [...displayedMessages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    chat.mutate(next, {
      onSuccess: (reply) => setMessages([...next, { role: "assistant", content: reply }]),
    });
  }

  return (
    <Overlay label="Assistant">
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-8">
          {displayedMessages.length === 0 && (
            <div className="animate-rise pt-[6vh] text-center">
              <p className="eyebrow mb-4">Club assistant</p>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
                Ask anything about <span className="text-accent">the club</span>
              </h1>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="btn btn-ghost">{s}</button>
                ))}
              </div>
            </div>
          )}

          {displayedMessages.map((m, i) => (
            <div key={i} className={`flex animate-rise ${m.role === "user" ? "justify-end" : ""}`}>
              <p
                className={`max-w-[85%] whitespace-pre-wrap rounded-md px-4 py-3 leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent text-on-accent"
                    : "border-2 border-line bg-surface"
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}

          {chat.isPending && (
            <p className="text-sm text-muted">Thinking…</p>
          )}
          {chat.isError && (
            <p role="alert" className="text-sm text-accent">Couldn't reach the assistant. Try again.</p>
          )}
          <div ref={(el) => el?.scrollIntoView({ behavior: "smooth", block: "end" })} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2 border-t-2 border-ink p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            aria-label="Message"
            className="field flex-1"
          />
          <button className="btn btn-primary" disabled={chat.isPending || !input.trim()}>Send</button>
        </form>
      </div>
    </Overlay>
  );
}
