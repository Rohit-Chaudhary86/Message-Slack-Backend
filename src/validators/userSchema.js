import { z } from "zod";

// export const userSignupSchema = z.object({
//   email: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) return "Email required";
//       return "Invalid email format";  // Fallback for non-string inputs
//     }
//   }).email("Invalid email address"),  // .email() can have its own message if needed
//   username: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) return " required";
//       return "Invalid username format";  // Fallback for non-string
//     }
//   }).min(3, { message: "Username must be at least 3 characters" }),  // Use 'message' for chained validators
//   password: z.string({
//     error: (issue) => {
//       if (issue.input === undefined) return " required";
//       return "Invalid password format";  // Fallback for non-string
//     }
//   }).min(1, { message: "Password cannot be empty" })  // Custom message for empty string
// });

export const userSignupSchema=z.object({
  email:z.string().email(),
  username:z.string().min(3),
  password:z.string()
});

export const userSignInSchema=z.object({
  email:z.string().email(),
  password:z.string()
})