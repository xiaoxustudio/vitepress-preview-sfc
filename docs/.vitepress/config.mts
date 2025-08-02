import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "vitepress-preview-sfc",
	description: "vitepress-preview-sfc",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Examples", link: "/examples" },
		],

		sidebar: [
			{
				text: "Examples",
				items: [{ text: "Markdown Examples", link: "/examples" }],
			},
		],

		socialLinks: [
			{ icon: "github", link: "https://github.com/vuejs/vitepress" },
		],
	},
	markdown: {
		config: md => {
			md.use(previewSfcCore, { alias: "PreView" });
		},
	},
});
