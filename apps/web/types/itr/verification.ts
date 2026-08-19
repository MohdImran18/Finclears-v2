export interface VerificationDetails {
    method:
        | "aadhaar"
        | "netbanking"
        | "dsc"
        | "evc";

    verified: boolean;

    acknowledgement?: string;
}
