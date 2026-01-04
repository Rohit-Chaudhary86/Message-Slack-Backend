import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

import userRepository from "../repositories/userRepositories.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clienterror.js";
import ValidationError from "../utils/errors/validationError.js";


const isUserAdminOfWorkspace=(workspace,userId)=>{
    return  workspace.members.find(
    (member) => (member.memberId.toString() === userId || member.memberId._id.toString()==userId) && member.role === "admin"
  )
};

export const isUserMemberOfWorkspace=(workspace,userId)=>{
   return  workspace.members.find(
    m => m.memberId.toString() === userId 
  )
}
const isChannelAlreadyPartOfWorkspace=(workspace,channelName)=>{
  return workspace.channels.find(
    (channel)=>channel.name.toLowerCase()==channelName.toLowerCase()
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
      statusCode: StatusCodes.NOT_FOUND
    });
  }

  const adminMember = isUserAdminOfWorkspace(workspace,userId)

  if (!adminMember) {
    throw new ClientError({
      explanation: "unauthorized action",
      message: "Only admin can delete workspace",
      statusCode: StatusCodes.FORBIDDEN
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
      statusCode: StatusCodes.NOT_FOUND
    });
  }
   const isMember=isUserMemberOfWorkspace(workspace,userId)
    if(!isMember){
      throw new ClientError({
      explanation: 'user is not a member of workspace',
      message: 'user is not a member of workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
    }
    return workspace
  } catch (error) {
     console.log('Get workspace service error',error)
     throw error;
  }

}

export const getWorkspaceByJoinCodeService=async(joinCode,userId)=>{
  try {
    const workspace=await workspaceRepository.getWorkspaceByJoinCode(joinCode)
     if (!workspace) {
    throw new ClientError({
      explanation: "invalid join code",
      message: "Workspace not found",
      statusCode: StatusCodes.NOT_FOUND
    });
  }
   const isMember=isUserMemberOfWorkspace(workspace,userId)
   if(!isMember){
    throw new ClientError({
      explanation :"user is not a member of workspace",
      message:"user is not a member of workspace",
      statusCode:StatusCodes.UNAUTHORIZED
    })
   }
  return workspace;
  } catch (error) {
    console.log('Get workspace service error',error)
    throw error
  }
}

export const updateWorkspaceService=async(workspaceId,workspaceData,userId)=>{
  try {
    const workspace=await workspaceRepository.getById(workspaceId)
    if(!workspace){
      throw new ClientError({
        explanation: "invalid data sent from client",
      message: "Workspace not found",
      statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin=isUserAdminOfWorkspace(workspace,userId);
    if(!isAdmin){
      throw new ClientError({
        explanation:"user is not an admin of workspace",
        message:"user is not an admin of workspace",
        statusCode:StatusCodes.UNAUTHORIZED
      })
    }
    const updatedWorkspace=await workspaceRepository.update(workspaceId,workspaceData)
    return updatedWorkspace

  } catch (error) {
    console.log('Update workspace service error',error)
    throw error
  }
}

export const addMemberToWorkspaceService=async(workspaceId,memberId,role,userId)=>{
  try {
    const workspace=await workspaceRepository.getById(workspaceId)
    if(!workspace){
      throw new ClientError({
        explanation: "invalid data sent from client",
      message: "Workspace not found",
      statusCode: StatusCodes.NOT_FOUND
      });
    }
     const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isValidUser=await userRepository.getById(memberId)
    if(!isValidUser){
      throw new ClientError({
        explanation:"invalid data sent from client",
        message:"user not found",
        statusCode:StatusCodes.NOT_FOUND
      })
    }
    const isMember=isUserMemberOfWorkspace(workspace,memberId);
    if (isMember) {
  throw new ClientError({
    explanation: "invalid data sent from client",
    message: "User already part of workspace",
    statusCode: StatusCodes.FORBIDDEN
  });
}
   const response=await workspaceRepository.addMemberToWorkspace(workspaceId,memberId,role)
   return response;
  } catch (error) {
    console.log("addMemberToWorkspaceService error",error);
    throw error
  }
}
export const addChannelToWorkspaceService=async(workspaceId,channelName,userId)=>{  // controller issue
  try {
    const workspace=await workspaceRepository.getWorkspaceDetailsById(workspaceId)
    if(!workspace){
      throw new ClientError({
      explanation: "invalid workspaceId code",
      message: "Workspace not found",
      statusCode: StatusCodes.NOT_FOUND
    });
    }
    //checking for admin bcs admin can only add member 
    const adminMember=isUserAdminOfWorkspace(workspace,userId)
    if (!adminMember) {
      throw new ClientError({
        explanation: "unauthorized action",
        message: "Only admin can add channels",
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const isChannelAlreadyAdded=isChannelAlreadyPartOfWorkspace(workspace,channelName)
    if(isChannelAlreadyAdded){
      throw new ClientError({
        explanation:"invalid data sent from client",
        message:"channel already part of workspace",
        statusCode:StatusCodes.FORBIDDEN
      })
    }
    const response=await workspaceRepository.addChannelToWorkspace(workspaceId,channelName);
    return response;
  } catch (error) {
    console.log("addChannelToWorkspaceService  error",error);
    throw error
  }
}

