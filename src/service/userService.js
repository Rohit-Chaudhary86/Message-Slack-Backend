import userRepositories from "../repositories/userRepositories.js"
import ValidationError from "../utils/errors/validationError.js";

export const signUpService=async(data)=>{
    try {
       const newUser=await userRepositories.create(data)
    return newUser;
    } catch (error) {
        console.log("user service error",error)

        if(error.name==="ValidationError"){
            throw new ValidationError(
                {
                    error:error.errors
                },
                error.message
            )
        }
        if ((error.name === "MongoServerError" || error.name === "MongooseError") && error.code === 11000) {
      throw new ValidationError(
        { error: ["A user with same name or email already exists"] },
        "A user with same name or email already exists"
      );
    }

    // Any other errors
    throw error;
  }
};
