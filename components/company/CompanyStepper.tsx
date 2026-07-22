"use client";

interface CompanyStepperProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: "Business",
    description: "Business Details",
  },
  {
    id: 2,
    title: "Directors",
    description: "Director Information",
  },
  {
    id: 3,
    title: "Shareholders",
    description: "Shareholder Details",
  },
  {
    id: 4,
    title: "Documents",
    description: "Upload Documents",
  },
  {
    id: 5,
    title: "Review",
    description: "Review & Submit",
  },
];

export default function CompanyStepper({
  currentStep,
}: CompanyStepperProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all
                    ${
                      completed
                        ? "border-green-600 bg-green-600 text-white"
                        : active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-500"
                    }
                  `}
                >
                  {completed ? "✓" : step.id}
                </div>

                <p
                  className={`mt-3 text-sm font-semibold ${
                    active
                      ? "text-blue-600"
                      : completed
                      ? "text-green-600"
                      : "text-slate-500"
                  }`}
                >
                  {step.title}
                </p>

                <p className="text-center text-xs text-slate-400">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-1 flex-1 rounded-full ${
                    completed
                      ? "bg-green-600"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
