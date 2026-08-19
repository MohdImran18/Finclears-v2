import { z } from "zod";

export const deduction80TTASchema = z.object({
    savingsInterest: z.number().min(0).default(0),

    eligibleDeduction: z.number().min(0).max(10000).default(0),
});

export type Deduction80TTA = z.infer<typeof deduction80TTASchema>;

