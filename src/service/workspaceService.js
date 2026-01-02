import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clienterror.js";
import ValidationError from "../utils/errors/validationError.js";

const isUserAdminOfWorkspace=(workspace,userId)=>{
    return  workspace.members.find(
    m => m.memberId.toString() === userId && m.role === "admin"
  )
};

const isUserMemberOfWorkspace=(workspace,userId)=>{
   return  workspace.members.find(
    m => m.memberId.toString() === userId 
  )
}


export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

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

export const getWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log('Get workspaces user is member of service error', error);
    throw error;
  }
};


export const deleteWorkspaceService = async (workspaceId, userId) => {
  const workspace = await workspaceRepository.getById(workspaceId);

  if (!workspace) {
    throw new ClientError({
      explanation: "invalid data sent from client",
      message: "Workspace not found",
      status: StatusCodes.NOT_FOUND
    });
  }

  const adminMember = isUserAdminOfWorkspace(workspace,userId)

  if (!adminMember) {
    throw new ClientError({
      explanation: "unauthorized action",
      message: "Only admin can delete workspace",
      status: StatusCodes.FORBIDDEN
    });
  }

  await workspaceRepository.deleteWorkspaceById(workspaceId);
}

export const getWorkspaceService  =async(workspaceId,userId)=>{
  try {
    const workspace=await workspaceRepository.getById(workspaceId);
  if(!workspace){
    throw new ClientError({
      explanation: 'invalid data sent from client',
      message: 'workspace not found',
      status: StatusCodes.NOT_FOUND
    });
  }
   const isMember=isUserMemberOfWorkspace(workspace,userId)
    if(!isMember){
      throw new ClientError({
      explanation: 'user is not a member of workspace',
      message: 'user is not a member of workspace',
      status: StatusCodes.UNAUTHORIZED
    });
    }
    return workspace
  } catch (error) {
     console.log('Get workspace service error',error)
     throw error;
  }

}

export const getWorkspaceByJoinCodeService=async(joinCode)=>{
  try {
    const workspace=await workspaceRepository.getWorkspaceByJoinCode(joinCode)
     if (!workspace) {
    throw new ClientError({
      explanation: "invalid join code",
      message: "Workspace not found",
      status: StatusCodes.NOT_FOUND
    });
  }

  return workspace;
  } catch (error) {
    console.log('Get workspace service error',error)
    throw error
  }
}