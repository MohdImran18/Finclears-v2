import { z } from "zod";

export const documentUploadSchema = z.object({
    panCard: z.string().optional(),

    aadhaarCard: z.string().optional(),

    form16: z.string().optional(),

    form26AS: z.string().optional(),

    ais: z.string().optional(),

    tis: z.string().optional(),

    investmentProof: z.string().optional(),

    bankStatement: z.string().optional(),
});

export type DocumentUpload = z.infer<typeof documentUploadSchema>;

