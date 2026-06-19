import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ViewSFC from "../src/components/ViewSFC.vue";

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
			props: { lazy: false },
			slots: {
				preview: '<div class="my-preview">Preview Content</div>'
			}
		});
		expect(wrapper.find(".my-preview").exists()).toBe(true);
	});

	it("shows code toggle and collapse buttons", () => {
		const wrapper = mount(ViewSFC);
		const buttons = wrapper.findAll("button");
		expect(buttons.length).toBeGreaterThanOrEqual(2);
	});

	it("toggles code visibility when clicking code button", async () => {
		const wrapper = mount(ViewSFC);
		const codeBtn = wrapper.findAll("button")[0];
		await codeBtn.trigger("click");
		expect(wrapper.emitted("codeActive")).toBeTruthy();
		expect(wrapper.emitted("codeActive")![0]).toEqual([true]);
	});

	it("has accessible button labels", () => {
		const wrapper = mount(ViewSFC);
		const buttons = wrapper.findAll("button");
		buttons.forEach((btn) => {
			expect(btn.attributes("aria-label")).toBeTruthy();
		});
	});
});
