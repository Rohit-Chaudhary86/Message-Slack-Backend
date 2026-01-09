import express from 'express';

import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { getMessages } from '../../controllers/messageController.js';

const router = express.Router();

router.get(
  '/messages/:channelId',
  isAuthenticated,
  getMessages
);

export default router;