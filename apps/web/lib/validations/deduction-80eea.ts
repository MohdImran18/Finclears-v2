import { z } from "zod";

export const deduction80EEASchema = z.object({
    interestPaid: z.number().min(0).default(0),

    eligibleDeduction: z.number().min(0).max(150000).default(0),
});

export type Deduction80EEA = z.infer<typeof deduction80EEASchema>;

