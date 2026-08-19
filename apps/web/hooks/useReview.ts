"use client";

import { useMutation } from "@tanstack/react-query";

import ReviewService from "@/services/review.service";

export function useReview() {
    return useMutation({
        mutationFn: (data: any) =>
            ReviewService.generate(data),
    });
}

