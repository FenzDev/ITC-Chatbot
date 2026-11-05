import { AI_API_KEY, AI_BASE_URL, AI_MODEL } from '../../config/env.js';
import { ChatConversation, type ChatRole } from './chat.model.js';
import { getAssistantContext, getEventsContext } from './chat.context.js';
import type { ChatInput } from './chat.validation.js';

type ProviderMessage = { role: ChatRole | 'system'; content: string };

function getMessages(input: ChatInput): ProviderMessage[] {
  if ('message' in input) {
    return [{ role: 'user', content: input.message }];
  }

  return input.messages;
}

export async function getHistory(userId: string) {
  const conversation = await ChatConversation.findOne({ user: userId }).lean();
  return conversation?.messages ?? [];
}

export async function clearHistory(userId: string) {
  await ChatConversation.deleteOne({ user: userId });
}

export async function streamReply(
  userId: string,
  input: ChatInput,
): Promise<AsyncGenerator<string>> {
  if (!AI_API_KEY) {
    throw new Error('AI_PROVIDER_NOT_CONFIGURED');
  }

  const inputMessages = getMessages(input);
  const conversation = await ChatConversation.findOneAndUpdate(
    { user: userId },
    { $push: { messages: { $each: inputMessages } } },
    { upsert: true, new: true },
  );

  const response = await fetch(`${AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: [await getAssistantContext(), await getEventsContext()].join('\n\n'),
        },
        ...conversation.messages.map(({ role, content }) => ({ role, content })),
      ],
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`AI_PROVIDER_ERROR:${response.status}`);
  }

  return readProviderStream(response.body, userId);
}

async function* readProviderStream(
  body: ReadableStream<Uint8Array>,
  userId: string,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let answer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') continue;

        const payload: unknown = JSON.parse(data);
        const content = extractContent(payload);
        if (content) {
          answer += content;
          yield content;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!answer) {
    throw new Error('AI_PROVIDER_EMPTY_RESPONSE');
  }

  await ChatConversation.updateOne(
    { user: userId },
    { $push: { messages: { role: 'assistant', content: answer } } },
  );
}

function extractContent(payload: unknown): string {
  if (!payload || typeof payload !== 'object' || !('choices' in payload)) return '';
  const choices = payload.choices;
  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== 'object') return '';
  const delta = 'delta' in choices[0] ? choices[0].delta : undefined;
  if (!delta || typeof delta !== 'object' || !('content' in delta)) return '';
  return typeof delta.content === 'string' ? delta.content : '';
}
