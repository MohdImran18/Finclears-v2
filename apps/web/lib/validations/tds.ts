import { z } from "zod";

export const tdsSchema = z.object({
    employerTds: z.number().min(0).default(0),

    bankTds: z.number().min(0).default(0),

    otherTds: z.number().min(0).default(0),

    totalTds: z.number().min(0).default(0),
});

export type TDS = z.infer<typeof tdsSchema>;

