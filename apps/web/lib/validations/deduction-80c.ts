import { z } from "zod";

export const deduction80CSchema = z.object({
    lifeInsurance: z.number().min(0).default(0),

    ppf: z.number().min(0).default(0),

    epf: z.number().min(0).default(0),

    elss: z.number().min(0).default(0),

    nsc: z.number().min(0).default(0),

    taxSaverFd: z.number().min(0).default(0),

    tuitionFees: z.number().min(0).default(0),

    homeLoanPrincipal: z.number().min(0).default(0),

    total80C: z.number().min(0).max(150000).default(0),
});

export type Deduction80C = z.infer<typeof deduction80CSchema>;

