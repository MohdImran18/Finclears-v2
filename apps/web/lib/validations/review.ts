import { z } from "zod";

export const reviewSchema = z.object({
    declarationAccepted: z.boolean(),

    previewGenerated: z.boolean().default(false),

    taxCalculated: z.boolean().default(false),

    readyForPayment: z.boolean().default(false),
});

export type Review = z.infer<typeof reviewSchema>;

