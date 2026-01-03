import express from 'express'

import { 
    addChannelToWorkspaceController,
  addMemberToWorkspaceServiceController,
  createWorkspaceController, 
  deleteWorkspaceController, 
  getWorkspaceByJoincodeController, 
  getWorkspaceController,  
  getWorkspacesUserIsMemberOfController, 
  updateWorkspaceServiceController
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddlewares.js';
import { addChannelToWorkspaceSchema, addMemberToWorkspaceSchema, createWorkSpaceSchema } from '../../validators/workspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkSpaceSchema), createWorkspaceController);
router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController); 
router.get('/join/:joinCode',isAuthenticated,getWorkspaceByJoincodeController);
router.put('/:workspaceId',isAuthenticated,updateWorkspaceServiceController)
router.put("/:workspaceId/members",isAuthenticated,validate(addMemberToWorkspaceSchema),addMemberToWorkspaceServiceController)
router.put('/:workspaceId/channels',isAuthenticated,validate(addChannelToWorkspaceSchema),addChannelToWorkspaceController)
export default router;