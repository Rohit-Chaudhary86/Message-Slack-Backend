import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalServerErrorResponse } from "../utils/common/responseObject";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/serverConfig";
import userRepository from "../repositories/userRepositories";

export const isAuthenticated=async(req,res,next)=>{
 try {
     const token=req.header['x-access-token'];
  if(!token){
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
            explanation:'invalid data sent from the client',
            message:'No auth token provided'
        })
    )
  }
  const response=jwt.verify(token,JWT_SECRET)
  if(!response){
    return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
            explanation:'invalid data sent from the client',
            message:'invalid auth token provided'
        })
    );
  }

 const user=await userRepository.getById(response.id)
 req.user=user.id
 next();

 } catch (error) {
    console.log('auth middleware error',error)
    if(error.name==='JsonWebTokenError'){
        return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
            explanation:'invalid data sent from the client',
            message:'invalid auth token provided'
        })
      );
    }
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalServerErrorResponse(error)
    )
 }
};