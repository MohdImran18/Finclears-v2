export interface PersonalDetails {
    assessmentYear: string;
    financialYear: string;

    pan: string;
    aadhaar: string;

    firstName: string;
    middleName?: string;
    lastName: string;

    dateOfBirth: string;

    mobile: string;
    email: string;

    fatherName: string;

    address: string;

    city: string;

    state: string;

    pincode: string;

    residentialStatus:
        | "resident"
        | "non_resident"
        | "rnor";
}
