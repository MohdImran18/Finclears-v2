export interface BankDetails {
    accountHolder: string;

    bankName: string;

    accountNumber: string;

    ifsc: string;

    accountType: "Savings" | "Current";

    primary: boolean;
}
