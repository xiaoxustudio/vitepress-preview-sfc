import { describe, it, expect } from "vitest";
import {
	checksArr,
	toName,
	composeComponentName,
	getCompoentName,
	getComponentRefName,
	hasVueRefImport
} from "./utils";
import type { IConfig } from "./types";

describe("checksArr", () => {
	it("generates regex patterns for single alias", () => {
		const config: IConfig = { alias: ["ViewSfc"] };
		const regexs = checksArr(config);
		expect(regexs).toHaveLength(2);
		expect(regexs[0]).toBeInstanceOf(RegExp);
	});

	it("matches inline ViewSfc tags", () => {
		const config: IConfig = { alias: ["ViewSfc"] };
		const regexs = checksArr(config);
		const result = regexs[0].exec('<ViewSfc src="./test.vue"></ViewSfc>');
		expect(result).not.toBeNull();
		expect(result![1]).toBe("ViewSfc");
	});

	it("matches self-closing ViewSfc tags", () => {
		const config: IConfig = { alias: ["ViewSfc"] };
		const regexs = checksArr(config);
		const result = regexs[1].exec('<ViewSfc src="./test.vue"/>');
		expect(result).not.toBeNull();
		expect(result![1]).toBe("ViewSfc");
	});

	it("generates patterns for custom alias", () => {
		const config: IConfig = { alias: ["PreView"] };
		const regexs = checksArr(config);
		expect(regexs).toHaveLength(2);
		const result = regexs[0].exec('<PreView src="./test.vue"></PreView>');
		expect(result).not.toBeNull();
		expect(result![1]).toBe("PreView");
	});

	it("generates patterns for multiple aliases", () => {
		const config: IConfig = { alias: ["ViewSfc", "PreView"] };
		const regexs = checksArr(config);
		expect(regexs).toHaveLength(4);
	});

	it("caches regex patterns", () => {
		const config1: IConfig = { alias: ["ViewSfc"] };
		const config2: IConfig = { alias: ["ViewSfc"] };
		const regexs1 = checksArr(config1);
		const regexs2 = checksArr(config2);
		expect(regexs1).toHaveLength(2);
		expect(regexs2).toHaveLength(2);
	});
});

describe("toName", () => {
	it("converts kebab-case to camelCase", () => {
		expect(toName("my-component")).toBe("myComponent");
	});

	it("converts snake_case to camelCase", () => {
		expect(toName("my_component")).toBe("myComponent");
	});

	it("handles multiple separators", () => {
		expect(toName("my-super-component")).toBe("mySuperComponent");
	});

	it("handles already camelCase", () => {
		expect(toName("myComponent")).toBe("myComponent");
	});
});

describe("composeComponentName", () => {
	it("extracts name from simple path", () => {
		expect(composeComponentName("./test.vue")).toBe("testvue");
	});

	it("handles nested paths", () => {
		expect(composeComponentName("./components/my-button.vue")).toBe(
			"components-my-buttonvue"
		);
	});

	it("removes special characters", () => {
		expect(composeComponentName("./components/my'button.vue")).toBe(
			"components-mybuttonvue"
		);
	});

	it("handles relative paths with parent dir", () => {
		expect(composeComponentName("../src/test.vue")).toBe("src-testvue");
	});
});

describe("getCompoentName", () => {
	it("generates component name with default suffix", () => {
		expect(getCompoentName("./test.vue")).toBe("testvueSfc");
	});

	it("generates component name with custom suffix", () => {
		expect(getCompoentName("./test.vue", "Preview")).toBe("testvuePreview");
	});

	it("handles kebab-case paths", () => {
		expect(getCompoentName("./my-component.vue")).toBe("myComponentvueSfc");
	});
});

describe("getComponentRefName", () => {
	it("joins component names with underscore and adds Ref suffix", () => {
		const sfcs = [
			{ componentName: "testSfc" },
			{ componentName: "otherSfc" }
		];
		expect(getComponentRefName(sfcs)).toBe("testSfc_otherSfcRef");
	});

	it("handles single component", () => {
		const sfcs = [{ componentName: "testSfc" }];
		expect(getComponentRefName(sfcs)).toBe("testSfcRef");
	});
});

describe("hasVueRefImport", () => {
	it("detects ref import from vue", () => {
		expect(hasVueRefImport('import { ref } from "vue"')).toBe(true);
	});

	it("detects ref import with other imports", () => {
		expect(hasVueRefImport('import { ref, computed } from "vue"')).toBe(
			true
		);
	});

	it("detects ref import with single quotes", () => {
		expect(hasVueRefImport("import { ref } from 'vue'")).toBe(true);
	});

	it("returns false when ref is not imported", () => {
		expect(hasVueRefImport('import { computed } from "vue"')).toBe(false);
	});

	it("returns false for non-vue imports", () => {
		expect(hasVueRefImport('import { ref } from "other-lib"')).toBe(false);
	});
});
