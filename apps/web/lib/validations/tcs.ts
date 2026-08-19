import { z } from "zod";

export const tcsSchema = z.object({
    sellerName: z.string().optional(),

    sellerTan: z.string().optional(),

    amount: z.number().min(0).default(0),
});

export type TCS = z.infer<typeof tcsSchema>;

