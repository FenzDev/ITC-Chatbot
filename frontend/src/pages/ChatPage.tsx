import { useState } from 'react';
import { useSendChat } from '@/features/chat/hooks';
import type { ChatMessage } from '@/features/chat/types';

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chat = useSendChat();

  function submit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(next);
    setInput('');
    chat.mutate(next, {
      onSuccess: ({ reply }) =>
        setMessages([...next, { role: 'assistant', content: reply }]),
    });
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Assistant</h1>
      <div className="mb-4 space-y-2">
        {messages.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'text-right' : ''}>
            {m.content}
          </p>
        ))}
        {chat.isPending && <p className="text-slate-500">Thinking…</p>}
        {chat.isError && <p className="text-red-600">Something went wrong.</p>}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the club…"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Send
        </button>
      </form>
    </>
  );
}
