// import { StatusCodes } from "http-status-codes";
// import jwt from 'jsonwebtoken'

// import { JWT_SECRET } from "../config/serverConfig.js";
// import userRepository from "../repositories/userRepositories.js";
// import { customErrorResponse, internalServerErrorResponse } from "../utils/common/responseObject.js";

// export const isAuthenticated=async(req,res,next)=>{
//  try {
//      const token = req.get('x-access-token');

//   if(!token){
//       return res.status(StatusCodes.FORBIDDEN).json(
//         customErrorResponse({
//             explanation:'invalid data sent from the client',
//             message:'No auth token provided'
//         })
//     )
//   }
//   const response=jwt.verify(token,JWT_SECRET)
//   if(!response){
//     return res.status(StatusCodes.FORBIDDEN).json(
//         customErrorResponse({
//             explanation:'invalid data sent from the client',
//             message:'invalid auth token provided'
//         })
//     );
//   }

//  const user=await userRepository.getById(response.id)
//  req.user=user.id
//  next();

//  } catch (error) {
//     console.log('auth middleware error',error)
//     if(error.name==='JsonWebTokenError'){
//         return res.status(StatusCodes.FORBIDDEN).json(
//         customErrorResponse({
//             explanation:'invalid data sent from the client',
//             message:'invalid auth token provided'
//         })
//       );
//     }
//     return res
//         .status(StatusCodes.INTERNAL_SERVER_ERROR)
//         .json(internalServerErrorResponse(error)
//     )
//  }
// };

import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepositories.js";
import {
  customErrorResponse,
  internalServerErrorResponse
} from "../utils/common/responseObject.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.get("x-access-token");

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "invalid data sent from the client",
          message: "No auth token provided"
        })
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userRepository.getById(decoded.id);
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "invalid data sent from the client",
          message: "User not found"
        })
      );
    }

    req.user = user.id;
    next();

  } catch (error) {
    console.log("auth middleware error", error);

    //  TOKEN EXPIRED 
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json(
        customErrorResponse({
          explanation: "authentication failed",
          message: "Session expired. Please login again."
        })
      );
    }

    //  INVALID TOKEN
    if (error.name === "JsonWebTokenError") {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "invalid data sent from the client",
          message: "Invalid auth token provided"
        })
      );
    }

    //  REAL SERVER ERRORS
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};
