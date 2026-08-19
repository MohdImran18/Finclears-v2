"use client";

import ShareholderForm, { type Shareholder } from "./forms/ShareholderForm";
import { useCompanyWizard } from "@/hooks/useCompanyWizard";

interface Props {
    next: () => void;
    previous: () => void;
}

export default function ShareholdersStep({ next, previous }: Props) {
    const { data, updateData } = useCompanyWizard();

    function handleNext(shareholders: Shareholder[]) {
        updateData({
            shareholders,
        });

        next();
    }

    return (
        <>
            <h2 className="mb-6 text-2xl font-bold">Company Shareholders</h2>

            <ShareholderForm
                defaultValues={data.shareholders ?? []}
                onNext={handleNext}
                onPrevious={previous}
            />
        </>
    );
}
