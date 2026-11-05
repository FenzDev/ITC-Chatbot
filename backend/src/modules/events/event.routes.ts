import { Router } from 'express';

import * as eventController from './event.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: List events
 *     description: Returns events ordered by date.
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event
 *     description: Returns one event by its MongoDB identifier.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Event identifier
 *     responses:
 *       200: { description: Event details }
 *       400: { description: Invalid event identifier }
 *       404: { description: Event not found }
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     description: Registers the authenticated member atomically, preventing duplicate registrations and over-capacity events.
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Registration successful }
 *       401: { description: Authentication required }
 *       403: { description: Member access required }
 *       404: { description: Event not found }
 *       409: { description: Already registered, event full, or registration closed }
 */
router.post('/:id/register', authenticate, requireRole('member'), eventController.registerForEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create an event
 *     description: Creates a new event. Intended for administrator access.
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201: { description: Event created }
 *       400: { description: Invalid event data }
 *       401: { description: Authentication required }
 *       403: { description: Administrator access required }
 */
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  eventController.createEvent,
);

export default router;