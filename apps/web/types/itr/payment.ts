export interface PaymentDetails {
    amount: number;

    paymentMethod: string;

    transactionId?: string;

    status:
        | "pending"
        | "success"
        | "failed";
}
