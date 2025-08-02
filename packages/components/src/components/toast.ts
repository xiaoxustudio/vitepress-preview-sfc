import { createApp, type App } from "vue";
import type { ToastOptions } from "@/types";
import ToastComponent from "@/components/Toast.vue";

let toastApp: App | null = null;
let toastContainer: HTMLElement | null = null;

const createToastContainer = () => {
	if (toastContainer) return;

	toastContainer = document.createElement("div");
	toastContainer.className = "toast-container";
	document.body.appendChild(toastContainer);
};

const showToast = (options: ToastOptions) => {
	createToastContainer();

	if (!toastContainer) return;

	const toastId = Date.now();
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
		},
	};

	toastApp = createApp(ToastComponent, props);
	toastApp.mount(toastElement);

	return toastId;
};

const toast = {
	show(message: string, options?: Omit<ToastOptions, "message">) {
		return showToast({
			message,
			...options,
		});
	},

	success(message: string, options?: Omit<ToastOptions, "message" | "type">) {
		return showToast({
			message,
			type: "success",
			...options,
		});
	},

	error(message: string, options?: Omit<ToastOptions, "message" | "type">) {
		return showToast({
			message,
			type: "error",
			...options,
		});
	},

	warning(message: string, options?: Omit<ToastOptions, "message" | "type">) {
		return showToast({
			message,
			type: "warning",
			...options,
		});
	},

	info(message: string, options?: Omit<ToastOptions, "message" | "type">) {
		return showToast({
			message,
			type: "info",
			...options,
		});
	},
};

export default toast;
