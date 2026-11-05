import type { Request, Response, NextFunction } from 'express';
import * as chatService from './chat.service.js';
import {
  assistantContextSchema,
  getAssistantContext,
  updateAssistantContext,
} from './chat.context.js';
import { chatSchema } from './chat.validation.js';

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: result.error.issues[0].message },
    });
    return;
  }

  try {
    const stream = await chatService.streamReply(req.user!.id, result.data);
    res.status(200).set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    if (error instanceof Error && error.message === 'AI_PROVIDER_NOT_CONFIGURED') {
      res.status(503).json({
        success: false,
        error: { code: 'AI_PROVIDER_NOT_CONFIGURED', message: 'AI provider is not configured' },
      });
      return;
    }
    next(error);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const messages = await chatService.getHistory(req.user!.id);
    res.set('Cache-Control', 'private, no-store');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
}

export async function clearHistory(req: Request, res: Response, next: NextFunction) {
  try {
    await chatService.clearHistory(req.user!.id);
    res.set('Cache-Control', 'private, no-store');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getContext(_req: Request, res: Response, next: NextFunction) {
  try {
    const content = await getAssistantContext();
    res.status(200).json({ success: true, data: { content } });
  } catch (error) {
    next(error);
  }
}

export async function updateContext(req: Request, res: Response, next: NextFunction) {
  const result = assistantContextSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: result.error.issues[0].message },
    });
    return;
  }

  try {
    const content = await updateAssistantContext(result.data.content);
    res.status(200).json({ success: true, data: { content } });
  } catch (error) {
    next(error);
  }
}
