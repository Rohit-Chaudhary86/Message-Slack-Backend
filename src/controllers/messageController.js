import { StatusCodes } from "http-status-codes";
import { getMessagesService } from "../service/messageService.js"
import { customErrorResponse, successResponse } from "../utils/common/responseObject";

export const getMessages=async(req,res)=>{
    try {
       
        const message=await getMessagesService({
            channelId:req.params.channelId,
            
        },req.query.page || 1,req.query.limit||20);
        return res
               .status(StatusCodes.OK)
               .json(successResponse(message,"messages fetched succesfully"))
    } catch (error) {
        console.log("message controller error",error);
        if(error.StatusCode){
            return res.status(error.StatusCode).json(customErrorResponse(error))
        }
        return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json(internalServerErrorResponse(error));
    }
}