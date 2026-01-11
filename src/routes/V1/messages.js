import express from 'express';

import { getMessages } from '../../controllers/messageController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get(
  '/messages/:channelId',
  isAuthenticated,
  getMessages
);

export default router;