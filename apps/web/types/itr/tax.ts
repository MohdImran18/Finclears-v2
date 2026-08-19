export interface TaxDetails {
    taxableIncome: number;

    oldTax: number;

    newTax: number;

    cess: number;

    rebate: number;

    surcharge: number;

    payable: number;

    refund: number;

    recommended: "old" | "new";
}
