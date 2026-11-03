import { Router } from 'express';

import * as eventController from './event.controller.js';

const router = Router();

router.get('/', eventController.getAllEvents);

router.get('/:id', eventController.getEventById);

router.post('/', eventController.createEvent);

export default router;