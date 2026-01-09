import messageRepository from "../repositories/messageRepository"


export const getMessagesService=(messageParams,page,limit)=>{
  const message=messageRepository.getPaginatedMessages(
    messageParams,
    page,
    limit
);
  return message;
};