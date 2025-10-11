import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, 'Username must contain at least 2 characters')
  .max(20, 'Username can contain up to 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password : z.string().min(6,{message:"password must contain 6 char"})
});
