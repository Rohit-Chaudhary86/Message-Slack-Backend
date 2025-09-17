import { StatusCodes } from "http-status-codes";

import { signUpService } from "../service/userService.js";
import {
  customErrorResponse,
  internalServerErrorResponse,
  successResponse,
} from "../utils/common/responseObject.js";

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, "User created successfully"));
  } catch (error) {
    console.log(" Raw error in controller:", error);

    // Handle duplicate key error
    const duplicateKeyError = error.code === 11000 || error?.cause?.code === 11000;
    if (duplicateKeyError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "A user with same UserName or Email already exists",
        err: error?.keyValue || error?.cause?.keyValue || {},
        data: {},
      });
    }

    // Handle custom ValidationError
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    // Fallback
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};
