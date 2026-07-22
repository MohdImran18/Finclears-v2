import { create } from "zustand";

import type {
  CompanyType,
  CompanyServiceType,
  CreateCompanyRequest,
} from "@/types/company";

interface CompanyWizardState {
  step: number;

  data: Partial<CreateCompanyRequest>;

  nextStep: () => void;

  previousStep: () => void;

  goToStep: (step: number) => void;

  updateData: (
    values: Partial<CreateCompanyRequest>
  ) => void;

  reset: () => void;
}

const initialData: Partial<CreateCompanyRequest> = {
  company_name: "",

  company_type:
    undefined as CompanyType | undefined,

  service_type:
    undefined as
      | CompanyServiceType
      | undefined,

  business_activity: "",

  authorized_capital: 0,

  paid_up_capital: 0,

  state: "",

  city: "",

  address: "",

  pin_code: "",

  promoters: [],
};

export const useCompanyWizardStore =
  create<CompanyWizardState>((set) => ({
    step: 1,

    data: initialData,

    nextStep: () =>
      set((state) => ({
        step: Math.min(
          state.step + 1,
          6
        ),
      })),

    previousStep: () =>
      set((state) => ({
        step: Math.max(
          state.step - 1,
          1
        ),
      })),

    goToStep: (step: number) =>
      set({
        step: Math.max(
          1,
          Math.min(step, 6)
        ),
      }),

    updateData: (
      values: Partial<CreateCompanyRequest>
    ) =>
      set((state) => ({
        data: {
          ...state.data,
          ...values,
        },
      })),

    reset: () =>
      set({
        step: 1,
        data: {
          ...initialData,
        },
      }),
  }));