import { StatusCodes } from "http-status-codes";

import { createWorkspaceService, deleteWorkspaceService, getWorkspaceByJoinCodeService, getWorkspaceService, getWorkspacesUserIsMemberOfService } from "../service/workspaceService.js";
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

export const getWorkspacesUserIsMemberOfController = async (req, res) => {
  try {
    const response = await getWorkspacesUserIsMemberOfService(req.user);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspaces fetched successfully'));
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};

export const deleteWorkspaceController = async (req, res) => {
  try {
    const response = await deleteWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace deleted successfully'));
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};

export const getWorkspaceController = async (req, res) => {
  try {
    const response = await getWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace fetched successfully'));
  } catch (error) {
    console.log('Get workspace controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};

export const getWorkspaceByJoincodeController=async(req,res)=>{
  try {
    const response=await getWorkspaceByJoinCodeService(
      req.params.joinCode
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response,'workspace fetched successfully by joincode'))
  } catch (error) {
    console.log('Get workspace controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
}

