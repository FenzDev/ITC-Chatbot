import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Overlay } from '@/components/ui/Overlay';
import {
  useChatHistory,
  useClearChatHistory,
  useSendChat,
} from '@/features/chat/hooks';
import { useGetUser } from '@/features/auth/hooks';
import type { ChatMessage } from '@/features/chat/types';

const suggestions = [
  'What events are coming up?',
  'Can you tell me more about ITC?',
  'What can you help with?',
];

export function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chat = useSendChat();
  const clearChat = useClearChatHistory();
  const { data: user } = useGetUser();
  const history = useChatHistory(Boolean(user));

  if (user && history.isPending) {
    return (
      <Overlay label="Assistant">
        <p className="p-5 text-muted">Loading conversation…</p>
      </Overlay>
    );
  }

  const displayedMessages =
    messages.length > 0 ? messages : (history.data ?? []);

  function send(text: string) {
    if (!text.trim() || chat.isPending) return;
    if (!user) {
      navigate('/register');
      return;
    }

    const next: ChatMessage[] = [
      ...displayedMessages,
      { role: 'user', content: text.trim() },
    ];
    setMessages(next);
    setInput('');
    chat.mutate(text.trim(), {
      onSuccess: (reply) =>
        setMessages([...next, { role: 'assistant', content: reply }]),
    });
  }

  function restartChat() {
    if (chat.isPending || clearChat.isPending) return;
    clearChat.mutate(undefined, { onSuccess: () => setMessages([]) });
  }

  return (
    <Overlay label="Assistant">
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        <div className="flex items-center justify-between border-b-2 border-line px-5 py-3">
          {displayedMessages.length > 0 && (
            <>
              <p className="text-sm font-bold text-muted">
                Your private conversation
              </p>
              <button
                type="button"
                onClick={restartChat}
                disabled={chat.isPending || clearChat.isPending}
                className="btn btn-ghost !px-3 !py-1.5 text-xs"
              >
                {clearChat.isPending ? 'Clearing…' : 'Restart chat'}
              </button>
            </>
          )}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-8">
          {displayedMessages.length === 0 && (
            <div className="animate-rise pt-[6vh] text-center">
              <p className="eyebrow mb-4">Club assistant</p>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
                Ask anything about <span className="text-accent">the club</span>
              </h1>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="btn btn-ghost"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {!user && (
                <p className="mx-auto mt-4 max-w-md text-ink text-xl">
                  Create an account to chat with the assistant
                  <br/>
                  It takes one minute!
                  <br/>
                  <Link
                    to="/register"
                    className="ml-1 font-bold text-accent hover:underline"
                  >
                    Register now
                  </Link>
                </p>
              )}
            </div>
          )}

          {displayedMessages.map((m, i) => (
            <div
              key={i}
              className={`flex animate-rise ${m.role === 'user' ? 'justify-end' : ''}`}
            >
              <p
                className={`max-w-[85%] whitespace-pre-wrap rounded-md px-4 py-3 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-accent text-on-accent'
                    : 'border-2 border-line bg-surface'
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}

          {chat.isPending && <p className="text-sm text-muted">Thinking…</p>}
          {chat.isError && (
            <p role="alert" className="text-sm text-accent">
              Couldn't reach the assistant. Try again.
            </p>
          )}
          <div
            ref={(el) =>
              el?.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }
          />
        </div>

        {user ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t-2 border-ink p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              aria-label="Message"
              className="field flex-1"
            />
            <button
              className="btn btn-primary"
              disabled={chat.isPending || !input.trim()}
            >
              Send
            </button>
          </form>
        ) : (
          <div className="border-t-2 border-ink p-4">
            <Link to="/register" className="btn btn-primary w-full">
              Register to chat
            </Link>
          </div>
        )}
      </div>
    </Overlay>
  );
}
