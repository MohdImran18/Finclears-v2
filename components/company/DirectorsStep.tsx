"use client";

import DirectorForm from "./forms/DirectorForm";

interface Props {
  next: () => void;
  previous: () => void;
}

export default function DirectorsStep({
  next,
  previous,
}: Props) {
  function handleNext() {
    // TODO:
    // Save directors in Company Wizard Store
    next();
  }

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">
        Company Directors
      </h2>

      <DirectorForm
        onPrevious={previous}
        onNext={handleNext}
      />
    </>
  );
}
