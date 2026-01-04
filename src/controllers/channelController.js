import { StatusCodes } from 'http-status-codes';

import { getChannelByIdService } from '../service/channelService.js';
import {
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export const getChannelByIdServiceController = async (req, res) => {
  try {
    const response = await getChannelByIdService(
      req.params.channelId,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Channel fetched succesfully'));
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
