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
			{ text: "Guide", link: "/guide" },
		],

		sidebar: [
			{
				text: "Guide",
				items: [
					{ text: "Guide", link: "/guide" },
					{ text: "Preview", link: "/preview" },
				],
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
