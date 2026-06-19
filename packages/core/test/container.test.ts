import { describe, it, expect } from "vitest";
import { transformAttributes } from "../src/container";

describe("transformAttributes", () => {
	it("parses quoted value with double quotes", () => {
		const result = transformAttributes(['title="hello world"']);
		expect(result).toEqual([{ title: "hello world" }]);
	});

	it("parses quoted value with single quotes", () => {
		const result = transformAttributes(["title='hello world'"]);
		expect(result).toEqual([{ title: "hello world" }]);
	});

	it("parses unquoted value with spaces", () => {
		const result = transformAttributes([
			"description=a component description with container"
		]);
		expect(result).toEqual([
			{ description: "a component description with container" }
		]);
	});

	it("parses unquoted value without spaces", () => {
		const result = transformAttributes(["src=./components/button.vue"]);
		expect(result).toEqual([{ src: "./components/button.vue" }]);
	});

	it("parses multiple lines", () => {
		const result = transformAttributes([
			"src=./components/button.vue",
			'title="My Title"',
			"description=hello world"
		]);
		expect(result).toEqual([
			{ src: "./components/button.vue" },
			{ title: "My Title" },
			{ description: "hello world" }
		]);
	});

	it("handles empty input", () => {
		const result = transformAttributes([]);
		expect(result).toEqual([]);
	});

	it("skips lines without valid attribute syntax", () => {
		const result = transformAttributes([
			"not-an-attribute",
			"src=test.vue"
		]);
		expect(result).toEqual([{ src: "test.vue" }]);
	});

	it("trims leading/trailing whitespace from line", () => {
		const result = transformAttributes(['  title  =  "hello"  ']);
		expect(result).toEqual([{ title: "hello" }]);
	});

	it("handles value with equals sign", () => {
		const result = transformAttributes(["url=https://example.com?v=1"]);
		expect(result).toEqual([{ url: "https://example.com?v=1" }]);
	});

	it("handles numeric values", () => {
		const result = transformAttributes(["count=42"]);
		expect(result).toEqual([{ count: "42" }]);
	});
});
