import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password is required")
});