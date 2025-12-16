import { StatusCodes } from "http-status-codes";

import User from "../schema/user.js";
import Workspace from "../schema/workSpace.js";
import ClientError from "../utils/errors/clienterror.js";
//import Channel from "../schema/channel.js";
import channelRepository from "./channelRepository.js";
import crudRepository from "./crudRepository.js";

const workspaceRepository = {
  ...crudRepository(Workspace),
  create: async function (data) {
    try {
      return await Workspace.create(data);
    } catch (error) {
      //  to identify duplicate names 
      if (error.code === 11000) {
        throw new ClientError({
          explanation: "invalid data sent from the client",
          message: "Workspace with this name already exists",
          status: StatusCodes.CONFLICT
        });
      }
      throw error;
    }
  },

  getWorkspaceByJoinCode:async function(joinCode){
     const workspace=await Workspace.findOne({joinCode})
      if(!workspace){
       throw new ClientError({
        explanation:'invalid data sent from client',
        message:'workspace not found',
        status:StatusCodes.NOT_FOUND
       })
     }
     return workspace
  },

  addMemberToWorkspace: async function (workspaceId, memberId, role = "member") {
    const workspace= await Workspace.findById(workspaceId)
    if(!workspace){
        throw new ClientError({
            explanation:"invalid data sent from the client",
            message:'Workspace not found',
            status:StatusCodes.NOT_FOUND
        });
    }
    
    const isValidUser=await User.findById(memberId)
     if(!isValidUser){
        throw new ClientError({
            explanation:"invalid data sent from the client",
            message:'user not found',
            status:StatusCodes.NOT_FOUND
        });
    }
 
    const isMemberAlreadyPartOfWorkspace=workspace.members.find(member=>  member.memberId.toString() === memberId.toString());
    if(isMemberAlreadyPartOfWorkspace){
        throw new ClientError({
            explanation:"invalid data sent from the client",
            message:'user already part of workspace ',
            status:StatusCodes.FORBIDDEN
        });
    }

    workspace.members.push({
        memberId,role
    });
    await workspace.save();
    return workspace
  },


  addChannelToWorkspace: async function(workspaceId,channelName){
   const workspace=await Workspace.findById(workspaceId).populate('channels');
   if(!workspace){
    throw new ClientError({
            explanation:"invalid data sent from the client",
            message:'workspace not found ',
            status:StatusCodes.NOT_FOUND
        });   
    }
    
    const isChannelAlreadyAdded = workspace.channels.some( channel => channel.name.toLowerCase() === channelName.toLowerCase());
      if(isChannelAlreadyAdded){
        throw new ClientError({
            explanation:'invalid data sent from client',
            message:'channel already a part of workspace',
            status:StatusCodes.FORBIDDEN
        })
    }

    const channel=await channelRepository.create({name:channelName})

    workspace.channels.push(channel._id); //i think it will break
    await workspace.save();

    return workspace;
  },
  fetchWorkspaceByMemberId:async function(memberId){
    const workspace=await Workspace.find({
        'members.memberId':memberId,
    }).populate('members.memberId','username email avatar')
    return workspace;
  }
  
};
export default workspaceRepository;