import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ViewSFC from "./ViewSFC.vue";

describe("ViewSFC", () => {
	it("renders without props", () => {
		const wrapper = mount(ViewSFC);
		expect(wrapper.exists()).toBe(true);
	});

	it("renders title when provided", () => {
		const wrapper = mount(ViewSFC, {
			props: { title: "Test Title" }
		});
		expect(wrapper.text()).toContain("Test Title");
	});

	it("renders description when provided", () => {
		const wrapper = mount(ViewSFC, {
			props: { description: "Test Description" }
		});
		expect(wrapper.text()).toContain("Test Description");
	});

	it("renders extension badge", () => {
		const wrapper = mount(ViewSFC, {
			props: { extension: "vue" }
		});
		const extEl = wrapper.find('[data-ext="vue"]');
		expect(extEl.exists()).toBe(true);
	});

	it("renders preview slot", () => {
		const wrapper = mount(ViewSFC, {
			slots: {
				preview: '<div class="my-preview">Preview Content</div>'
			}
		});
		expect(wrapper.find(".my-preview").exists()).toBe(true);
	});

	it("shows code toggle button", () => {
		const wrapper = mount(ViewSFC);
		const buttons = wrapper.findAll("button");
		expect(buttons.length).toBeGreaterThanOrEqual(1);
	});
});
