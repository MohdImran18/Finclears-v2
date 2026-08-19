"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PersonalData {
    assessmentYear: string;
    financialYear: string;
    pan: string;
    aadhaar: string;
    mobile: string;
    email: string;
    name: string;
}

export interface IncomeData {
    salary: number;
    houseProperty: number;
    otherSources: number;
    grossIncome: number;
}

export interface DeductionData {
    section80c: number;
    section80d: number;
    section80ccd1b: number;
    section80tta: number;
    total: number;
}

export interface TaxData {
    taxableIncome: number;
    oldTax: number;
    newTax: number;
    recommended: "" | "old" | "new";
    payable: number;
}

export interface ReviewData {
    completed: boolean;
    declarationAccepted: boolean;
}

interface StateData {
    uuid: string | null;

    currentStep: number;

    personal: PersonalData;

    income: IncomeData;

    deductions: DeductionData;

    tax: TaxData;

    review: ReviewData;

    loading: boolean;

    error: string | null;
}

export interface ItrState extends StateData {
    setUuid: (uuid: string | null) => void;

    setStep: (step: number) => void;

    setPersonal: (data: Partial<PersonalData>) => void;

    setIncome: (data: Partial<IncomeData>) => void;

    setDeductions: (data: Partial<DeductionData>) => void;

    setTax: (data: Partial<TaxData>) => void;

    setReview: (data: Partial<ReviewData>) => void;

    setLoading: (loading: boolean) => void;

    setError: (error: string | null) => void;

    reset: () => void;
}

const initialState: StateData = {
    uuid: null,

    currentStep: 1,

    personal: {
        assessmentYear: "2026-27",
        financialYear: "2025-26",
        pan: "",
        aadhaar: "",
        mobile: "",
        email: "",
        name: "",
    },

    income: {
        salary: 0,
        houseProperty: 0,
        otherSources: 0,
        grossIncome: 0,
    },

    deductions: {
        section80c: 0,
        section80d: 0,
        section80ccd1b: 0,
        section80tta: 0,
        total: 0,
    },

    tax: {
        taxableIncome: 0,
        oldTax: 0,
        newTax: 0,
        recommended: "",
        payable: 0,
    },

    review: {
        completed: false,
        declarationAccepted: false,
    },

    loading: false,

    error: null,
};

export const useItrStore = create<ItrState>()(
    persist(
        (set) => ({
            ...initialState,

            setUuid: (uuid) =>
                set({
                    uuid,
                }),

            setStep: (step) =>
                set({
                    currentStep: step,
                }),

            setPersonal: (data) =>
                set((state) => ({
                    personal: {
                        ...state.personal,
                        ...data,
                    },
                })),

            setIncome: (data) =>
                set((state) => ({
                    income: {
                        ...state.income,
                        ...data,
                    },
                })),

            setDeductions: (data) =>
                set((state) => ({
                    deductions: {
                        ...state.deductions,
                        ...data,
                    },
                })),

            setTax: (data) =>
                set((state) => ({
                    tax: {
                        ...state.tax,
                        ...data,
                    },
                })),

            setReview: (data) =>
                set((state) => ({
                    review: {
                        ...state.review,
                        ...data,
                    },
                })),

            setLoading: (loading) =>
                set({
                    loading,
                }),

            setError: (error) =>
                set({
                    error,
                }),

            reset: () =>
                set(initialState),
        }),
        {
            name: "finclears-itr-store",
        },
    ),
);

export default useItrStore;
