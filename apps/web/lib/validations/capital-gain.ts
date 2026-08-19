import { z } from "zod";

export const capitalGainSchema = z.object({
    shortTermGain: z.number().default(0),

    longTermGain: z.number().default(0),

    equityGain: z.number().default(0),

    propertyGain: z.number().default(0),
});

export type CapitalGain = z.infer<typeof capitalGainSchema>;

