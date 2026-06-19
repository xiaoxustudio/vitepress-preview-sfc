import { describe, it, expect, beforeEach } from "vitest";
import ToastComponent from "./Toast.vue";

// We need to re-import toast after each SSR guard test
const getToast = async () => {
	// Dynamic import to get fresh module
	const mod = await import("./toast");
	return mod.default;
};

describe("toast", () => {
	beforeEach(() => {
		if (typeof document !== "undefined") {
			document.body.innerHTML = "";
		}
	});

	it("exports show, success, error, warning, info methods", async () => {
		const toast = await getToast();
		expect(toast.show).toBeTypeOf("function");
		expect(toast.success).toBeTypeOf("function");
		expect(toast.error).toBeTypeOf("function");
		expect(toast.warning).toBeTypeOf("function");
		expect(toast.info).toBeTypeOf("function");
	});

	it("creates toast container in DOM on show", async () => {
		const toast = await getToast();
		const id = toast.show(ToastComponent, "Test message");
		expect(id).toBeTypeOf("number");
		const container = document.querySelector(".toast-container");
		expect(container).not.toBeNull();
	});
});
