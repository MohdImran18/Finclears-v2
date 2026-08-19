import { z } from "zod";

export const verificationSchema = z.object({
    verificationMethod: z.enum([
        "aadhaar_otp",
        "net_banking",
        "digital_signature",
        "bank_account",
        "physical_itrv",
    ]),

    verified: z.boolean().default(false),

    acknowledgementNumber: z.string().optional(),

    verifiedAt: z.string().optional(),
});

export type Verification = z.infer<typeof verificationSchema>;

