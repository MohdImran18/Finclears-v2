import { z } from "zod";

export const otherIncomeSchema = z.object({
    interestIncome: z.number().min(0).default(0),

    dividendIncome: z.number().min(0).default(0),

    familyPension: z.number().min(0).default(0),

    lotteryIncome: z.number().min(0).default(0),

    otherIncome: z.number().min(0).default(0),
});

export type OtherIncome = z.infer<typeof otherIncomeSchema>;

