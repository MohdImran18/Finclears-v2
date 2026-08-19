import api from "@/lib/api";

export const TaxService = {
    calculate(data: any) {
        return api.post(
            "/tax/calculate",
            data
        );
    },
};

export default TaxService;
