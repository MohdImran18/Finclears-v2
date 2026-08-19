import { z } from "zod";

export const businessIncomeSchema = z.object({
    turnover: z.number().min(0).default(0),

    expenses: z.number().min(0).default(0),

    profit: z.number().default(0),

    presumptive44AD: z.boolean().default(false),

    presumptive44ADA: z.boolean().default(false),
});

export type BusinessIncome = z.infer<typeof businessIncomeSchema>;

