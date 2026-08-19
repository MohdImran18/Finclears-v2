"use client";

import { useItrStore } from "@/store/itr";

export function useItrWizard() {
    const step = useItrStore((state) => state.currentStep);

    const setStep = useItrStore((state) => state.setStep);

    const next = () => setStep(Math.min(step + 1, 7));

    const previous = () => setStep(Math.max(step - 1, 1));

    const goTo = (value: number) => setStep(value);

    return {
        step,
        next,
        previous,
        goTo,
    };
}

