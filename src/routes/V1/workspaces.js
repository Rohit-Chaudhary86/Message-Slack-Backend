import express from 'express'

import { 
  createWorkspaceController, 
  deleteWorkspaceController, 
  getWorkspaceByJoincodeController, 
  getWorkspaceController,  
  getWorkspacesUserIsMemberOfController 
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { createWorkSpaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkSpaceSchema), createWorkspaceController);
router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController); 
router.get('/join/:joinCode',isAuthenticated,getWorkspaceByJoincodeController)

export default router;