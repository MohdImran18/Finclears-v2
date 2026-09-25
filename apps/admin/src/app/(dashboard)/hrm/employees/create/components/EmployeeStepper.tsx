"use client";

interface EmployeeStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  {
    number: 1,
    title: "Account",
    description: "Login information",
  },
  {
    number: 2,
    title: "Employment",
    description: "Role & reporting",
  },
  {
    number: 3,
    title: "Personal",
    description: "Contact & address",
  },
  {
    number: 4,
    title: "Emergency",
    description: "Emergency contact",
  },
  {
    number: 5,
    title: "Payroll",
    description: "Identity & banking",
  },
];

export default function EmployeeStepper({
  currentStep,
  onStepChange,
}: EmployeeStepperProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div
              key={step.number}
              className="flex min-w-0 flex-1 items-center"
            >
              <button
                type="button"
                onClick={() => onStepChange(step.number)}
                className="group flex min-w-0 items-center gap-3 border-0 bg-transparent p-0 text-left"
              >
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                    isActive
                      ? "border-[#087f78] bg-[#087f78] text-white shadow-md"
                      : isCompleted
                        ? "border-[#087f78] bg-[#e8f7f5] text-[#087f78]"
                        : "border-slate-200 bg-white text-slate-400 group-hover:border-[#087f78] group-hover:text-[#087f78]",
                  ].join(" ")}
                >
                  {isCompleted ? "✓" : `0${step.number}`}
                </span>

                <span className="hidden min-w-0 md:block">
                  <span
                    className={[
                      "block truncate text-sm font-bold",
                      isActive || isCompleted
                        ? "text-slate-800"
                        : "text-slate-400",
                    ].join(" ")}
                  >
                    {step.title}
                  </span>

                  <span className="block truncate text-xs text-slate-400">
                    {step.description}
                  </span>
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mx-3 h-px flex-1",
                    currentStep > step.number
                      ? "bg-[#087f78]"
                      : "bg-slate-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
