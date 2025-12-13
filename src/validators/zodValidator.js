import { StatusCodes } from "http-status-codes";

import { customErrorResponse } from "../utils/common/responseObject.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      console.log("Validation error in zod validator", error.issues);

      const messages = error.issues.map((issue) => {
        const field = issue.path[0] || "field";  // Fallback if path is missing
        return `${field} ${issue.message}`;
      });

      const errorMessage = messages.length > 0 ? " : " + messages.join(" : ") : "";

      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: "Validation error" + errorMessage,
          explanation: messages  // Use the array directly
        })
      );
    }
  };
};