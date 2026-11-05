import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { chatRateLimit } from '../../middleware/chat-rate-limit.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as chatController from './chat.controller.js';

const router = Router();

router.use(authenticate, requireRole('member'));
/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Stream an AI chat response
 *     description: Sends a member message and streams the AI answer as Server-Sent Events. Limited to 10 requests per member per minute.
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [message]
 *                 properties:
 *                   message: { type: string, minLength: 1, maxLength: 4000 }
 *               - type: object
 *                 required: [messages]
 *                 properties:
 *                   messages:
 *                     type: array
 *                     items: { $ref: '#/components/schemas/ChatMessage' }
 *     responses:
 *       200:
 *         description: SSE stream containing response chunks and a final DONE event
 *         content:
 *           text/event-stream:
 *             schema: { type: string, example: 'data: {"content":"Hello"}\n\ndata: [DONE]\n\n' }
 *       400: { description: Invalid chat message }
 *       401: { description: Authentication required }
 *       403: { description: Member access required }
 *       429: { description: Chat rate limit exceeded }
 *       503: { description: AI provider is not configured }
 */
router.post('/', chatRateLimit, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history
 *     description: Returns the authenticated member's conversation history. The response is private and is never publicly cached.
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Conversation messages }
 *       401: { description: Authentication required }
 *       403: { description: Member access required }
 */
router.get('/history', chatController.getHistory);

export default router;
