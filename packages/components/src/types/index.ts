import type { VNode } from "vue";

// src/types/toast.ts
export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
	| "top-right"
	| "top-left"
	| "bottom-right"
	| "bottom-left";

export interface ToastOptions {
	id?: number;
	message?: string;
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

export interface ViewSfcBtn {
	key: string;
	title: VNode | string;
	tip?: string;
	onClick: () => void;
}

export interface ViewSfcProps {
	title?: string;
	description?: string;
	src?: string;
	code?: string;
	htmlCode?: string;
	buttonGroup?: ViewSfcBtn[];
	extension?: string; // 后缀
	sfcs?: any[];
}

export interface ViewSfcEmits {
	(e: "codeActive", state: boolean): void;
}

export interface ViewSfcSlots {
	preview?: () => any;
	title?: (props: { title: string }) => any;
	description?: (props: { description: string }) => any;
	codeView?: () => any;
	[key: string]: any;
}
