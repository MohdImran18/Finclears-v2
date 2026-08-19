import { z } from "zod";

export const deduction80DSchema = z.object({
    selfFamily: z.number().min(0).default(0),

    parents: z.number().min(0).default(0),

    preventiveHealthCheckup: z.number().min(0).default(0),

    total80D: z.number().default(0),
});

export type Deduction80D = z.infer<typeof deduction80DSchema>;

