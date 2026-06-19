import { describe, it, expect } from "vitest";
import { defaultLocales, detectLocale } from "./locales";

describe("defaultLocales", () => {
	it("provides zh locale", () => {
		expect(defaultLocales.zh).toBeDefined();
		expect(defaultLocales.zh.collapseText).toBe("收起");
		expect(defaultLocales.zh.copyTextSuccess).toBe("复制成功");
		expect(defaultLocales.zh.copyTextError).toBe("复制失败");
	});

	it("provides en locale", () => {
		expect(defaultLocales.en).toBeDefined();
		expect(defaultLocales.en.collapseText).toBe("Collapse");
		expect(defaultLocales.en.copyTextSuccess).toBe("Copy Success");
		expect(defaultLocales.en.copyTextError).toBe("Copy Error");
	});

	it("includes accessibility labels in zh", () => {
		expect(defaultLocales.zh.accessibility.btnGroupLabel).toBe(
			"代码预览控制区"
		);
		expect(defaultLocales.zh.accessibility.codeRegionLabel).toBe(
			"源代码查看器"
		);
		expect(defaultLocales.zh.accessibility.collapseBtnLabel).toBe(
			"收起代码"
		);
	});

	it("includes accessibility labels in en", () => {
		expect(defaultLocales.en.accessibility.btnGroupLabel).toBe(
			"Code preview controls"
		);
		expect(defaultLocales.en.accessibility.codeRegionLabel).toBe(
			"Source code viewer"
		);
		expect(defaultLocales.en.accessibility.collapseBtnLabel).toBe(
			"Collapse code"
		);
	});
});

describe("detectLocale", () => {
	it("returns en when document is undefined", () => {
		expect(detectLocale()).toBe("en");
	});
});
