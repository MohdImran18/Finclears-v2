"use client";

import CompanyStepper from "./CompanyStepper";

import BusinessDetailsStep from "./BusinessDetailsStep";
import DirectorsStep from "./DirectorsStep";
import ShareholdersStep from "./ShareholdersStep";
import DocumentsStep from "./DocumentsStep";
import ReviewStep from "./ReviewStep";

import { useCompanyWizard } from "@/hooks/useCompanyWizard";

export default function CompanyWizard() {
  const {
    step,
    nextStep,
    previousStep,
  } = useCompanyWizard();

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <CompanyStepper currentStep={step} />

      <div className="rounded-2xl bg-white p-8 shadow">

        {step === 1 && (
          <BusinessDetailsStep
            next={nextStep}
          />
        )}

        {step === 2 && (
          <DirectorsStep
            next={nextStep}
            previous={previousStep}
          />
        )}

        {step === 3 && (
          <ShareholdersStep
            next={nextStep}
            previous={previousStep}
          />
        )}

        {step === 4 && (
          <DocumentsStep
            next={nextStep}
            previous={previousStep}
          />
        )}

        {step === 5 && (
          <ReviewStep
            previous={previousStep}
          />
        )}

      </div>

    </div>
  );
}
