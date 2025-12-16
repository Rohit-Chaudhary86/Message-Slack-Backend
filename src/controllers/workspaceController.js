import { StatusCodes } from "http-status-codes";

import { createWorkspaceService } from "../service/workspaceService.js";
import { customErrorResponse, internalServerErrorResponse, successResponse } from "../utils/common/responseObject.js";


export const createWorkspaceController=async(req,res)=>{
    try {
        const response=await createWorkspaceService({
            ...req.body,
            owner:req.user
        });
        return res.status(StatusCodes.CREATED)
                  .json(successResponse(response,'Workspace created succesfully'))
    } catch (error) {
        console.log("error in controller",error)
           // Handle custom ValidationError
            if (error.statusCode) {
              return res.status(error.statusCode).json(customErrorResponse(error));
            }
        
            // Fallback
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json(internalServerErrorResponse(error));
        }
}

