import { z } from "zod";

import { personalDetailsSchema } from "./personal-details";

import { salaryIncomeSchema } from "./salary-income";
import { housePropertySchema } from "./house-property";
import { businessIncomeSchema } from "./business-income";
import { capitalGainSchema } from "./capital-gain";
import { otherIncomeSchema } from "./other-income";

import { deduction80CSchema } from "./deduction-80c";
import { deduction80DSchema } from "./deduction-80d";
import { deduction80GSchema } from "./deduction-80g";
import { deduction80TTASchema } from "./deduction-80tta";
import { deduction80EEASchema } from "./deduction-80eea";

import { advanceTaxSchema } from "./advance-tax";
import { tdsSchema } from "./tds";
import { tcsSchema } from "./tcs";

import { bankAccountSchema } from "./bank-account";

import { documentUploadSchema } from "./document-upload";

import { reviewSchema } from "./review";
import { paymentSchema } from "./payment";
import { verificationSchema } from "./verification";

export const itrSchema = z.object({
    personal: personalDetailsSchema,

    salary: salaryIncomeSchema,

    houseProperty: housePropertySchema,

    business: businessIncomeSchema,

    capitalGain: capitalGainSchema,

    otherIncome: otherIncomeSchema,

    deduction80C: deduction80CSchema,

    deduction80D: deduction80DSchema,

    deduction80G: deduction80GSchema,

    deduction80TTA: deduction80TTASchema,

    deduction80EEA: deduction80EEASchema,

    advanceTax: advanceTaxSchema,

    tds: tdsSchema,

    tcs: tcsSchema,

    bank: bankAccountSchema,

    documents: documentUploadSchema,

    review: reviewSchema,

    payment: paymentSchema,

    verification: verificationSchema,
});

export type ItrSchema = z.infer<typeof itrSchema>;

