import { z } from "zod";

export const housePropertySchema = z.object({
  propertyType: z.string().optional(),
  annualValue: z.number().default(0),
  municipalTax: z.number().default(0),
  interestOnLoan: z.number().default(0),
});

export type HousePropertySchema = z.infer<typeof housePropertySchema>;

