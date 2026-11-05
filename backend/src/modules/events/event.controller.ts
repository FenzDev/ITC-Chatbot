import type { Request, Response, NextFunction } from 'express';

import * as eventService from './event.service.js';
import { createEventSchema } from './event.validation.js';

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = createEventSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: result.error.issues[0].message,
        },
      });
      return;
    }

    const event = await eventService.createEvent(result.data);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllEvents(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;

    if (typeof id !== 'string') {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid event ID',
        },
      });
      return;
    }

    const event = await eventService.getEventById(id);

    if (!event) {
      res.status(404).json({
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
}

export async function registerForEvent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid event ID' },
      });
      return;
    }

    await eventService.registerForEvent(id, req.user!.id);
    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
    });
  } catch (error) {
    if (error instanceof Error) {
      const responses: Record<string, { status: number; message: string }> = {
        EVENT_NOT_FOUND: { status: 404, message: 'Event not found' },
        ALREADY_REGISTERED: {
          status: 409,
          message: 'Already registered for this event',
        },
        EVENT_FULL: { status: 409, message: 'Event is full' },
        REGISTRATION_CLOSED: { status: 409, message: 'Registration is closed' },
      };
      const response = responses[error.message];
      if (response) {
        res.status(response.status).json({
          success: false,
          error: { code: error.message, message: response.message },
        });
        return;
      }
    }
    next(error);
  }
}
