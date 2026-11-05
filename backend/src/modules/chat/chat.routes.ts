import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as chatController from './chat.controller.js';

const router = Router();

router.use(authenticate, requireRole('member'));
router.post('/', chatController.sendMessage);
router.get('/history', chatController.getHistory);

export default router;
