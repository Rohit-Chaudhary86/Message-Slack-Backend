import { v4 as uuidv4 } from "uuid";


import workspaceRepository from "../repositories/workspaceRepository.js";

import ValidationError from "../utils/errors/validationError.js";
import { StatusCodes } from "http-status-codes";
import ClientError from "../utils/errors/clienterror.js";

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toLocaleUpperCase();

    const workspace = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
      workspace._id,
      workspaceData.owner,
      "admin"
    );

    const updatedWorkspace =
      await workspaceRepository.addChannelToWorkspace(
        workspace._id,
        "general"
      );

    return updatedWorkspace;

  } catch (error) {
    //  DUPLICATE WORKSPACE NAME ERROR
    if (error.code === 11000 && error.name==='MongoServerError') {
      throw new ValidationError({
        error: ['A Workspace with same details already exist']
        
      },
      'A Workspace with same details already exist '
   );
    }
    throw error;
  }
};

export const getWorkspaceService=async(memberId)=>{
   const workspace=await workspaceRepository.fetchWorkspaceByMemberId(memberId)
   return workspace
}


export const deleteWorkspaceService = async (workspaceId, userId) => {
  const workspace = await workspaceRepository.getById(workspaceId);

  if (!workspace) {
    throw new ClientError({
      explanation: "invalid data sent from client",
      message: "Workspace not found",
      status: StatusCodes.NOT_FOUND
    });
  }

  const adminMember = workspace.members.find(
    m => m.memberId.toString() === userId && m.role === "admin"
  );

  if (!adminMember) {
    throw new ClientError({
      explanation: "unauthorized action",
      message: "Only admin can delete workspace",
      status: StatusCodes.FORBIDDEN
    });
  }

  await workspaceRepository.deleteWorksapceById(workspaceId);
};
