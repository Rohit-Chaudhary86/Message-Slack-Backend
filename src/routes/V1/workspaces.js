import express from 'express'

import { createWorkspaceController, deleteWorkspaceController, getUserWorkspacesController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { createWorkSpaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';


const router=express.Router()
router.post('/',isAuthenticated,validate(createWorkSpaceSchema),createWorkspaceController)
router.get('/',isAuthenticated,getUserWorkspacesController)
router.delete('/:workspaceId',isAuthenticated,deleteWorkspaceController)
export default router;