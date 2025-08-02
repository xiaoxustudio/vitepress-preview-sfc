// src/types/toast.ts
export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left";

export interface ToastOptions {
	id?: number;
	message: string;
	type?: ToastType;
	position?: ToastPosition;
	duration?: number;
	closable?: boolean;
	onClick?: () => void;
}

export interface ToastInstance extends ToastOptions {
	id: number;
	timer?: ReturnType<typeof setTimeout>;
	remainingTime?: number;
	paused?: boolean;
}
