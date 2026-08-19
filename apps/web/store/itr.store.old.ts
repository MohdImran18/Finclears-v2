import { create } from "zustand";

interface ItrState {
	uuid: string | null;
	currentStep: number;

	setUuid: (uuid: string) => void;
	setStep: (step: number) => void;
	reset: () => void;
}

export const useItrStore = create<ItrState>((set) => ({
	uuid: null,

	currentStep: 1,

	setUuid: (uuid) =>
		set({
			uuid,
		}),

	setStep: (step) =>
		set({
			currentStep: step,
		}),

	reset: () =>
		set({
			uuid: null,
			currentStep: 1,
		}),
}));
