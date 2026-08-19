import { z } from "zod";

export const advanceTaxSchema = z.object({
    firstInstallment: z.number().min(0).default(0),

    secondInstallment: z.number().min(0).default(0),

    thirdInstallment: z.number().min(0).default(0),

    fourthInstallment: z.number().min(0).default(0),

    totalAdvanceTax: z.number().min(0).default(0),
});

export type AdvanceTax = z.infer<typeof advanceTaxSchema>;

