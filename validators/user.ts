import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name is required")
      .max(255),

    email: z
      .string()
      .email(),

    phone: z
      .string()
      .optional(),

    role: z.enum([
      "super_admin",
      "admin",
      "employee",
      "client",
    ]),

    status: z.enum([
      "active",
      "inactive",
    ]),

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

export const updateUserSchema =
  createUserSchema.partial();