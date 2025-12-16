import express from 'express'

import { createWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { createWorkSpaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';


const router=express.Router()
router.post('/',isAuthenticated,validate(createWorkSpaceSchema),createWorkspaceController)
export default router;