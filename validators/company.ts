import { z } from "zod";

export const companySchema = z.object({
  company_name: z
    .string()
    .min(2, "Company name is required"),

  service_type: z.enum([
    "private_limited",
    "llp",
    "opc",
    "section8",
    "foreign_company",
  ]),

  company_type: z.enum([
    "private",
    "public",
    "llp",
    "opc",
  ]),

  business_activity: z
    .string()
    .min(2, "Business activity is required"),

  authorized_capital: z
    .number({
      error:
        "Authorized capital is required",
    })
    .min(1),

  paid_up_capital: z
    .number({
      error:
        "Paid up capital is required",
    })
    .min(1),

  state: z
    .string()
    .min(2, "State is required"),

  city: z
    .string()
    .min(2, "City is required"),

  address: z
    .string()
    .min(5, "Address is required"),

  pin_code: z
    .string()
    .min(6, "PIN code is required"),
});

export type CompanyInput =
  z.infer<typeof companySchema>;

