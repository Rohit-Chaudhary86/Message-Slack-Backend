import express from 'express'

import { getChannelByIdServiceController } from '../../controllers/channelController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
const router = express.Router();

router.get('/:channelId',isAuthenticated,getChannelByIdServiceController)

export default router;