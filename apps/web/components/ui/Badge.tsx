import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",

	{
		variants: {
			variant: {
				default: "bg-indigo-100 text-indigo-700",

				success: "bg-emerald-100 text-emerald-700",

				warning: "bg-yellow-100 text-yellow-700",

				danger: "bg-red-100 text-red-700",
			},
		},

		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div
			className={cn(
				badgeVariants({
					variant,
				}),
				className,
			)}
			{...props}
		/>
	);
}

