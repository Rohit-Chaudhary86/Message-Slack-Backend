import { StatusCodes } from "http-status-codes";

import { createWorkspaceService, deleteWorkspaceService, getWorkspaceService } from "../service/workspaceService.js";
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

export const getUserWorkspacesController = async (req, res) => {
  try {
    const workspaces =
      await getWorkspaceService(req.user);

    return res.status(200).json({
      success: true,
      data: workspaces,
      message: "Workspaces fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces"
    });
  }
};

export const deleteWorkspaceController=async (req,res,next)=>{
  try {
    const { workspaceId } = req.params;

    await deleteWorkspaceService(workspaceId, req.user);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}
