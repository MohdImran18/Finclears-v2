"use client";

import DirectorForm, { type Director } from "./forms/DirectorForm";
import { useCompanyWizard } from "@/hooks/useCompanyWizard";

interface Props {
    next: () => void;
    previous: () => void;
}

export default function DirectorsStep({ next, previous }: Props) {
    const { data, updateData } = useCompanyWizard();

    function handleNext(directors: Director[]) {
        updateData({
            promoters: directors,
        });

        next();
    }

    return (
        <>
            <h2 className="mb-6 text-2xl font-bold">Company Directors</h2>

            <DirectorForm
                defaultValues={data.promoters ?? []}
                onPrevious={previous}
                onNext={handleNext}
            />
        </>
    );
}
