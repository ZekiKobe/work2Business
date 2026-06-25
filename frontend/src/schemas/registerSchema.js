import { z } from "zod";

export const personalInfoSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export const employmentSchema = z.object({
  profession: z.string().min(1, "Profession is required"),
  employer: z.string().optional()
});

export const financialSchema = z.object({
  monthlySalary: z.coerce
    .number()
    .min(0, "Salary must be a positive number"),
  availableCapital: z.coerce
    .number()
    .min(0, "Available capital must be a positive number"),
  availableHoursPerWeek: z.coerce
    .number()
    .min(1, "Please enter available hours per week")
    .max(168, "Maximum 168 hours per week")
});
