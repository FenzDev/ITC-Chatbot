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
