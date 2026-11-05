import { z } from 'zod';
import { AssistantContext } from './chat.model.js';
import { getAssistantEvents } from '../events/event.service.js';

export const DEFAULT_ASSISTANT_CONTEXT =
  'You are the ITC Hub club assistant. Be helpful, concise, and friendly. ' +
  'Answer questions about the club and its events using only information available in the conversation. ' +
  'If you do not know something, say so instead of inventing details.';

export const assistantContextSchema = z.object({
  content: z.string().trim().min(1).max(10000),
});

export async function getAssistantContext() {
  const context = await AssistantContext.findOne({ key: 'default' }).lean();
  return context?.content ?? DEFAULT_ASSISTANT_CONTEXT;
}

export async function updateAssistantContext(content: string) {
  const context = await AssistantContext.findOneAndUpdate(
    { key: 'default' },
    { $set: { content }, $setOnInsert: { key: 'default' } },
    { new: true, upsert: true, runValidators: true },
  );
  return context.content;
}

export async function getEventsContext() {
  const events = await getAssistantEvents();

  if (events.length === 0) {
    return 'There are currently no upcoming or ongoing events available.';
  }

  return [
    'The following event data is current and comes from the ITC Hub events database.',
    'Use it to answer event questions. Do not invent or modify these details.',
    '<events>',
    ...events.map((event) =>
      [
        `Title: ${event.title}`,
        `Description: ${event.description}`,
        `Location: ${event.location}`,
        `Date: ${event.date.toISOString()}`,
        `Registration deadline: ${event.registrationDeadline.toISOString()}`,
        `Capacity: ${event.capacity}`,
        `Status: ${event.status}`,
      ].join('\n'),
    ),
    '</events>',
  ].join('\n\n');
}
