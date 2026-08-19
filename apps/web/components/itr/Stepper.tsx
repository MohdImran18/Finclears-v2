"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
	currentStep: number;
}

const steps = [
	"Personal",
	"Income",
	"Deductions",
	"Tax",
	"Review",
	"Payment",
	"Verification",
];

export default function Stepper({ currentStep }: StepperProps) {
	return (
		<div className="mb-10 flex items-center justify-between overflow-x-auto">
			{steps.map((step, index) => {
				const completed = currentStep > index + 1;

				const active = currentStep === index + 1;

				return (
					<div key={step} className="flex flex-1 items-center">
						<div className="flex flex-col items-center">
							<div
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",

									completed && "border-emerald-500 bg-emerald-500 text-white",

									active && "border-indigo-600 bg-indigo-600 text-white",

									!completed &&
										!active &&
										"border-slate-300 bg-white text-slate-500",
								)}
							>
								{completed ? <Check className="h-5 w-5" /> : index + 1}
							</div>

							<span className="mt-2 text-xs font-medium text-slate-600">
								{step}
							</span>
						</div>

						{index !== steps.length - 1 && (
							<div
								className={cn(
									"mx-2 h-1 flex-1 rounded",

									completed ? "bg-emerald-500" : "bg-slate-200",
								)}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

