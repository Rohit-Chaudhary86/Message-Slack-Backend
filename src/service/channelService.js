import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import ClientError from "../utils/errors/clienterror.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";


export const getChannelByIdService=async (channelId,userId)=>{
  try {
    const channel=await channelRepository.getChannelWithWorkspaceDetails(channelId)
    console.log(channel);
    
    if(!channel || !channel.workspaceId ){
      throw new ClientError({
        explanation:"invalid data sent from client",
        message:"channel  not found for the given id",
        statusCode: StatusCodes.NOT_FOUND
      })
    }
    const isUserPartOfWorkspace=isUserMemberOfWorkspace(channel.workspaceId,userId);
    if(!isUserPartOfWorkspace){
        throw new ClientError({
        explanation:"user is not a member of workspace and hence can not access the channel",
        message:"user is not a member of workspace",
        statusCode: StatusCodes.UNAUTHORIZED
        })
    }
    return channel
  } catch (error) {
    console.log("getChannelById error",error);
    throw error
  }
}