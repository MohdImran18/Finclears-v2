import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name is required"),

    email: z.email("Invalid email"),

    phone: z
      .string()
      .min(10, "Phone number is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
