import { z } from "zod";

export const deduction80GSchema = z.object({
    donationAmount: z.number().min(0).default(0),

    eligibleAmount: z.number().min(0).default(0),

    institutionName: z.string().optional(),

    pan: z.string().optional(),
});

export type Deduction80G = z.infer<typeof deduction80GSchema>;

