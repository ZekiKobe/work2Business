import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  profession: z.string().min(2),
  employer: z.string().min(2),

  monthlySalary: z.coerce.number().min(1),
  availableCapital: z.coerce.number().min(0),

  skills: z.array(z.string()).min(1),
  interests: z.array(z.string()).min(1)
});