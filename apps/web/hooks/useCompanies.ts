"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import * as CompanyService from "@/services/company/company.service";

import type {
        Company,
        CompanyFilters,
        CreateCompanyRequest,
        UpdateCompanyRequest,
} from "@/types/company";

interface CompaniesResponse {
        data: Company[];
}

export function useCompanies(filters?: CompanyFilters) {
        return useQuery<CompaniesResponse>({
                queryKey: ["companies", filters],

                queryFn: async () => {
                        return CompanyService.getCompanies(filters);
                },
        });
}

export function useCreateCompany() {
        return useMutation({
                mutationFn: (data: CreateCompanyRequest) =>
                        CompanyService.createCompany(data),
        });
}

export function useCompany(id: number) {
        return useQuery({
                queryKey: ["company", id],

                queryFn: () => CompanyService.getCompany(id),

                enabled: Number.isFinite(id) && id > 0,
        });
}

export function useUpdateCompany() {
        return useMutation({
                mutationFn: ({
                        id,
                        data,
                }: {
                        id: number;
                        data: UpdateCompanyRequest;
                }) => CompanyService.updateCompany(id, data),
        });
}
