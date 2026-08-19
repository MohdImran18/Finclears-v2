"use client";

import { XIcon } from "lucide-react";
import type * as React from "react";
import {
	Dialog as DialogPrimitive,
	type DialogProps as DialogPrimitiveProps,
	DialogTrigger as DialogTriggerPrimitive,
	type DialogTriggerProps as DialogTriggerPrimitiveProps,
	Heading,
	ModalOverlay as ModalOverlayPrimitive,
	type ModalOverlayProps,
	Modal as ModalPrimitive,
} from "react-aria-components";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DialogTrigger(props: DialogTriggerPrimitiveProps) {
	return <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />;
}

function DialogClose({
	className,
	variant = "outline",
	size = "default",
	...props
}: React.ComponentProps<typeof Button>) {
	return (
		<Button
			slot="close"
			data-slot="dialog-close"
			variant={variant}
			size={size}
			className={cn(className)}
			{...props}
		/>
	);
}

interface DialogProps
	extends Omit<ModalOverlayProps, "className" | "children"> {
	children: React.ReactNode;

	className?: string;

	showCloseButton?: boolean;

	isDismissable?: boolean;

	open?: boolean;

	onOpenChange?: (open: boolean) => void;
}

function Dialog({
	className,
	children,
	showCloseButton = true,
	isDismissable = true,
	open,
	onOpenChange,
	...props
}: DialogProps) {
	return (
		<ModalOverlayPrimitive
			isOpen={open}
			onOpenChange={onOpenChange}
			isDismissable={isDismissable}
			className={cn(
				"fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
				"data-entering:animate-in",
				"data-entering:fade-in-0",
				"data-exiting:animate-out",
				"data-exiting:fade-out-0",
			)}
			{...props}
		>
			<ModalPrimitive
				className={cn(
					"fixed left-1/2 top-1/2 z-50",
					"grid w-full max-w-[calc(100%-2rem)]",
					"-translate-x-1/2 -translate-y-1/2",
					"gap-6 rounded-xl",
					"bg-background p-6",
					"ring-1 ring-border",
					"outline-none",
					"data-entering:animate-in",
					"data-entering:zoom-in-95",
					"data-exiting:animate-out",
					"data-exiting:zoom-out-95",
					"sm:max-w-md",
					className,
				)}
			>
				<DialogPrimitive className="[display:inherit] [gap:inherit] outline-none">
					{children}

					{showCloseButton && (
						<DialogClose
							variant="ghost"
							
							className="absolute right-4 top-4"
						>
							<XIcon className="h-4 w-4" />
						</DialogClose>
					)}
				</DialogPrimitive>
			</ModalPrimitive>
		</ModalOverlayPrimitive>
	);
}

function DialogContent(props: DialogProps) {
	return <Dialog {...props} />;
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function DialogFooter({
	className,
	children,
	showCloseButton = false,
	...props
}: React.ComponentProps<"div"> & {
	showCloseButton?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		>
			{children}

			{showCloseButton && <DialogClose variant="outline">Close</DialogClose>}
		</div>
	);
}

function DialogTitle({
	className,
	...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
	return (
		<Heading
			slot="title"
			className={cn("font-heading text-lg font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export type { DialogPrimitiveProps, DialogTriggerPrimitiveProps };
export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};

