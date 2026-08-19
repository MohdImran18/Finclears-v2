import { z } from "zod";

export const paymentSchema = z.object({
    amount: z.number().min(0),

    paymentMethod: z.enum([
        "UPI",
        "NetBanking",
        "CreditCard",
        "DebitCard",
        "NEFT",
        "RTGS",
    ]),

    transactionId: z.string().optional(),

    paid: z.boolean().default(false),
});

export type Payment = z.infer<typeof paymentSchema>;

