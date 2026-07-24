import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2),

    email: z.email(),

    phone: z
      .string()
      .min(10),

    password: z
      .string()
      .min(8),

    password_confirmation:
      z.string(),
  })
  .refine(
    (data) =>
      data.password ===
      data.password_confirmation,
    {
      path: [
        "password_confirmation",
      ],
      message:
        "Passwords do not match",
    }
  );