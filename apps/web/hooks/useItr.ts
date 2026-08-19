"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import ItrService from "@/services/itr.service";

/* ================================
   Create ITR
================================ */

export function useCreateItr() {
    return useMutation({
        mutationFn: (data: any) =>
            ItrService.create(data),
    });
}

/* ================================
   Get All
================================ */

export function useItrList() {
    return useQuery({
        queryKey: ["itr-list"],
        queryFn: () =>
            ItrService.getAll(),
    });
}

/* ================================
   Get One
================================ */

export function useItr(uuid: string) {
    return useQuery({
        queryKey: ["itr", uuid],
        queryFn: () =>
            ItrService.get(uuid),

        enabled: !!uuid,
    });
}

/* ================================
   Update
================================ */

export function useUpdateItr() {
    return useMutation({
        mutationFn: ({
            uuid,
            data,
        }: {
            uuid: string;
            data: any;
        }) =>
            ItrService.update(
                uuid,
                data
            ),
    });
}

/* ================================
   Calculate Tax
================================ */

export function useCalculateItrTax() {
    return useMutation({
        mutationFn: ({
            uuid,
            data,
        }: {
            uuid: string;
            data: any;
        }) =>
            ItrService.calculate(
                uuid,
                data
            ),
    });
}

/* ================================
   Submit
================================ */

export function useSubmitItr() {
    return useMutation({
        mutationFn: (uuid: string) =>
            ItrService.submit(uuid),
    });
}

