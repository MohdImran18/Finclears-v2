"use client";

import { useMutation } from "@tanstack/react-query";

import TaxService from "@/services/tax.service";

export function useTaxCalculation() {
    return useMutation({
        mutationFn: (data: any) =>
            TaxService.calculate(data),
    });
}

