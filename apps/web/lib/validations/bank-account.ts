import { z } from "zod";

export const bankAccountSchema = z.object({
    accountHolderName: z.string().min(1),

    bankName: z.string().min(1),

    accountNumber: z.string().min(6),

    ifsc: z
        .string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),

    accountType: z.enum([
        "Savings",
        "Current",
    ]),

    primary: z.boolean().default(true),
});

export type BankAccount = z.infer<typeof bankAccountSchema>;

