import { describe, it, expect } from "vitest";
import { ViewSfcConfigFn } from "../src/config";

describe("ViewSfcConfigFn", () => {
	it("defaults to en locale in Node.js", () => {
		const config = ViewSfcConfigFn();
		expect(config.collapseText.value).toBe("Collapse");
		expect(config.copyTextSuccess.value).toBe("Copy Success");
		expect(config.copyTextError.value).toBe("Copy Error");
	});

	it("switches to zh locale via setLocale", () => {
		const config = ViewSfcConfigFn();
		config.setLocale("zh");
		expect(config.collapseText.value).toBe("收起");
		expect(config.copyTextSuccess.value).toBe("复制成功");
		expect(config.copyTextError.value).toBe("复制失败");
	});

	it("switches back to en locale", () => {
		const config = ViewSfcConfigFn();
		config.setLocale("zh");
		config.setLocale("en");
		expect(config.collapseText.value).toBe("Collapse");
	});

	it("ignores unknown locale", () => {
		const config = ViewSfcConfigFn();
		config.setLocale("fr" as any);
		expect(config.collapseText.value).toBe("Collapse");
	});

	it("updates accessibility labels on locale change", () => {
		const config = ViewSfcConfigFn();
		expect(config.accessibility.btnGroupLabel).toBe(
			"Code preview controls"
		);
		config.setLocale("zh");
		expect(config.accessibility.btnGroupLabel).toBe("代码预览控制区");
		expect(config.accessibility.codeRegionLabel).toBe("源代码查看器");
		expect(config.accessibility.collapseBtnLabel).toBe("收起代码");
	});

	it("provides custom locale support", () => {
		const config = ViewSfcConfigFn();
		config.locales.jp = {
			collapseText: "折りたたむ",
			copyTextSuccess: "コピー成功",
			copyTextError: "コピー失敗",
			showCodeText: "コードを表示",
			copyCodeText: "コードをコピー",
			accessibility: {
				btnGroupLabel: "コードプレビューコントロール",
				codeRegionLabel: "ソースコードビューア",
				collapseBtnLabel: "コードを折りたたむ"
			}
		};
		config.setLocale("jp");
		expect(config.collapseText.value).toBe("折りたたむ");
		expect(config.copyTextSuccess.value).toBe("コピー成功");
	});
});
