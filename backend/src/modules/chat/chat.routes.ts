import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { chatRateLimit } from '../../middleware/chat-rate-limit.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as chatController from './chat.controller.js';

const router = Router();

router.use(authenticate);
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
router.post('/', requireRole('member'), chatRateLimit, chatController.sendMessage);

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
router.get('/history', requireRole('member'), chatController.getHistory);
/**
 * @swagger
 * /api/chat/history:
 *   delete:
 *     summary: Clear chat history
 *     description: Deletes the authenticated member's conversation history.
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204: { description: Conversation history cleared }
 *       401: { description: Authentication required }
 *       403: { description: Member access required }
 */
router.delete('/history', requireRole('member'), chatController.clearHistory);

/**
 * @swagger
 * /api/chat/context:
 *   get:
 *     summary: Get assistant context
 *     description: Returns the instructions used to guide the AI assistant.
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Assistant context }
 *       401: { description: Authentication required }
 *       403: { description: Administrator access required }
 */
router.get('/context', requireRole('admin'), chatController.getContext);

/**
 * @swagger
 * /api/chat/context:
 *   put:
 *     summary: Update assistant context
 *     description: Replaces the instructions used to guide the AI assistant.
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, minLength: 1, maxLength: 10000 }
 *     responses:
 *       200: { description: Assistant context updated }
 *       400: { description: Invalid context }
 *       401: { description: Authentication required }
 *       403: { description: Administrator access required }
 */
router.put('/context', requireRole('admin'), chatController.updateContext);

export default router;
