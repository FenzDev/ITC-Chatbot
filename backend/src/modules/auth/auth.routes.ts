import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a member
 *     description: Validates the registration data, hashes the password, and creates a member account.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 50, example: ITC Member }
 *               email: { type: string, format: email, example: member@example.com }
 *               password: { type: string, minLength: 8, maxLength: 72, format: password, example: Password123 }
 *     responses:
 *       201:
 *         description: Member registered and authentication cookie set
 *       400:
 *         description: Invalid registration data
 *       409:
 *         description: Email is already registered
 */
router.post('/register', authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Validates credentials and sets an HTTP-only authentication cookie.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200: { description: Login successful and authentication cookie set }
 *       400: { description: Invalid request data }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Clears the authentication cookie.
 *     tags: [Authentication]
 *     responses:
 *       200: { description: Successfully logged out }
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the current user
 *     description: Returns the authenticated user's profile.
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401: { description: Authentication required or token invalid }
 *       404: { description: User not found }
 */
router.get('/me', authenticate, authController.me);

export default router;
