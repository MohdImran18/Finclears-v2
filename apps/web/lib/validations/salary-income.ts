import { z } from "zod";

export const salaryIncomeSchema = z.object({
    employerName: z.string().trim().optional(),

    employerTan: z.string().trim().optional(),

    grossSalary: z.number().min(0).default(0),

    exemptAllowance: z.number().min(0).default(0),

    standardDeduction: z.number().min(0).default(50000),

    professionalTax: z.number().min(0).default(0),

    tds: z.number().min(0).default(0),
});

export type SalaryIncome = z.infer<typeof salaryIncomeSchema>;

