import bcrypt from 'bcrypt'
import { StatusCodes } from "http-status-codes";

import { MAIL_ID } from "../config/serverConfig.js";
import { addEmailToMailQueue } from "../producers/mailQueueProducer.js";
// import { JWT_SECRET } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepositories.js";
import userRepositories from "../repositories/userRepositories.js"
import { createJWT } from "../utils/common/authUtils.js";
import ClientError from "../utils/errors/clienterror.js";
import ValidationError from "../utils/errors/validationError.js";

export const signUpService = async (data) => {
  try {
    const newUser = await userRepositories.create(data);

    // 🔥 enqueue welcome email (non-blocking & safe)
    try {
      await addEmailToMailQueue({
        from: MAIL_ID,
        to: newUser.email,
        subject: "Welcome to Message-Slack 🎉",
        text: `Hi ${newUser.username}, your account has been created successfully.`
      });
      console.log("📩 Welcome email job queued");
    } catch (mailError) {
      // Email failure should NOT break signup
      console.error("⚠️ Failed to queue welcome email:", mailError);
    }

    return newUser;
  } catch (error) {
    console.log("user service error", error);

    if (error.name === "ValidationError") {
      throw new ValidationError(
        { error: error.errors },
        error.message
      );
    }

    if (
      (error.name === "MongoServerError" || error.name === "MongooseError") &&
      error.code === 11000
    ) {
      throw new ValidationError(
        { error: ["A user with same name or email already exists"] },
        "A user with same name or email already exists"
      );
    }

    throw error;
  }
};



export const signInService=async(data)=>{
  try {
    const user=await userRepository.getByEmail(data.email)
    if(!user){
      throw new ClientError({
        explanation:"invalid data sent from client",
        message:"no registered user found with this email",
        statusCode: StatusCodes.NOT_FOUND
      })
    }
    // match the incoming pass with hash pass
    const isMatch= bcrypt.compareSync(data.password,user.password)
    if(!isMatch){
      throw new ClientError({
        explanation:"Invalid data sent from client side",
        message:"Invalid Pass , Please try again with correct password",
        statusCode:StatusCodes.BAD_REQUEST
      })
    }
  //if email and pass match then we will genrate a token and send it back
   return{
    username:user.username,
    avatar:user.avatar,
    email:user.email,
    token:createJWT({id: user._id, email: user.email})
   }

  } catch (error) {
    console.log("user service error",error)
    throw error;
  }
}
