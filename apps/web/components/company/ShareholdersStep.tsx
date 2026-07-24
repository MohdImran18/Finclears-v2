"use client";

import ShareholderForm from "./forms/ShareholderForm";

interface Props {
  next: () => void;
  previous: () => void;
}

export default function ShareholdersStep({
  next,
  previous,
}: Props) {

  function handleNext() {
    // TODO:
    // Save shareholders to Company Wizard Store
    next();
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">
        Company Shareholders
      </h2>

      <ShareholderForm
        onNext={handleNext}
        onPrevious={previous}
      />
    </>
  );
}
