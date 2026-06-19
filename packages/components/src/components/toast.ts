import { createApp, type App, type Component } from "vue";
import type { ToastOptions } from "@/types";

let toastIdCounter = 0;
const toastApps = new Map<number, App>();
let toastContainer: HTMLElement | null = null;

function isBrowser(): boolean {
	return typeof document !== "undefined" && typeof window !== "undefined";
}

const createToastContainer = () => {
	if (!isBrowser()) return;
	if (toastContainer) return;

	toastContainer = document.createElement("div");
	toastContainer.className = "toast-container";
	document.body.appendChild(toastContainer);
};

function showToast(Comp: Component, options: ToastOptions) {
	if (!isBrowser()) return;

	createToastContainer();

	if (!toastContainer) return;

	const toastId = ++toastIdCounter;
	const toastElement = document.createElement("div");
	toastContainer.appendChild(toastElement);

	const props = {
		...options,
		id: toastId,
		onClose: () => {
			const app = toastApps.get(toastId);
			if (app) {
				app.unmount();
				toastApps.delete(toastId);
			}
			toastElement.remove();

			if (toastContainer && toastContainer.children.length === 0) {
				toastContainer.remove();
				toastContainer = null;
			}
		}
	};
	const app = createApp(Comp, props);
	toastApps.set(toastId, app);
	app.mount(toastElement);

	return toastId;
}

const toast = {
	show(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message">
	) {
		return showToast(Comp, {
			message,
			...options
		});
	},

	success(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message" | "type">
	) {
		return showToast(Comp, {
			message,
			type: "success",
			...options
		});
	},

	error(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message" | "type">
	) {
		return showToast(Comp, {
			message,
			type: "error",
			...options
		});
	},

	warning(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message" | "type">
	) {
		return showToast(Comp, {
			message,
			type: "warning",
			...options
		});
	},

	info(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message" | "type">
	) {
		return showToast(Comp, {
			message,
			type: "info",
			...options
		});
	}
};

export function resetToastState() {
	toastApps.forEach((app) => app.unmount());
	toastApps.clear();
	toastIdCounter = 0;
	if (toastContainer) {
		toastContainer.remove();
		toastContainer = null;
	}
}

export default toast;
