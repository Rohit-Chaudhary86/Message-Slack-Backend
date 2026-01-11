import { StatusCodes } from "http-status-codes";

import { getMessagesService } from "../service/messageService.js";
import {
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from "../utils/common/responseObject.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await getMessagesService(
      { channelId: req.params.channelId },
      req.user.id,                
      req.query.page || 1,
      req.query.limit || 20
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, "messages fetched successfully"));
  } catch (error) {
    console.log("message controller error", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};
