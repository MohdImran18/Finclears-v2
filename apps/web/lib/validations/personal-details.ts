// lib/validations/personal-details.ts

import { z } from "zod";

export const personalDetailsSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().optional(),

  pan: z
    .string()
    .toUpperCase()
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN"),

  aadhaar: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must be 12 digits")
    .optional(),

  email: z.string().email(),

  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  date_of_birth: z.string(),

  gender: z.enum(["Male", "Female", "Other"]),

  father_name: z.string().min(2),

  address: z.string(),

  city: z.string(),

  state: z.string(),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Invalid pincode"),
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;

