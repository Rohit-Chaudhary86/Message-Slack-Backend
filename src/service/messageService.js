import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import ClientError from "../utils/errors/clienterror.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getMessagesService = async (messageParams, userId, page, limit) => {

 
  const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
    messageParams.channelId
  );

  if (!channelDetails) {
    throw new ClientError({
      explanation: "Invalid channel id",
      message: "Channel not found",
      statusCode: StatusCodes.NOT_FOUND
    });
  }

  const workspaceId = channelDetails.workspaceId;

 
  const isMember = await isUserMemberOfWorkspace(workspaceId, userId);

  if (!isMember) {
    throw new ClientError({
      explanation: "User is not a member of workspace",
      message: "User is not authorized to access messages",
      statusCode: StatusCodes.UNAUTHORIZED
    });
  }


  const messages = await messageRepository.getPaginatedMessages(
    messageParams,
    page,
    limit
  );

  return messages;
};

export const createMessageService=async(message)=>{
   const newMessage=await messageRepository.create(message);
   return newMessage;
}
