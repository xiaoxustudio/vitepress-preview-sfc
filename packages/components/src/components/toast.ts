import { computed, createApp, type App, type Component } from "vue";
import type { ToastOptions } from "@/types";

let toastApp: App | null = null;
let toastContainer: HTMLElement | null = null;

const createToastContainer = () => {
	if (toastContainer) return;

	toastContainer = document.createElement("div");
	toastContainer.className = "toast-container";
	document.body.appendChild(toastContainer);
};

const showToast = computed(() => (Comp: Component, options: ToastOptions) => {
	createToastContainer();

	if (!toastContainer) return;

	const toastId = Date.now() + Date.now();
	const toastElement = document.createElement("div");
	toastContainer.appendChild(toastElement);

	const props = {
		...options,
		id: toastId,
		onClose: () => {
			toastApp?.unmount();
			toastElement.remove();

			// 如果容器中没有子元素，移除容器
			if (toastContainer && toastContainer.children.length === 0) {
				toastContainer.remove();
				toastContainer = null;
			}
		}
	};
	toastApp = createApp(Comp, props);
	toastApp.mount(toastElement);

	return toastId;
});

const toast = {
	show(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message">
	) {
		return showToast.value(Comp, {
			message,
			...options
		});
	},

	success(
		Comp: Component,
		message: string,
		options?: Omit<ToastOptions, "message" | "type">
	) {
		return showToast.value(Comp, {
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
		return showToast.value(Comp, {
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
		return showToast.value(Comp, {
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
		return showToast.value(Comp, {
			message,
			type: "info",
			...options
		});
	}
};

export default toast;
