import { defineConfig } from "vitepress";
import VueJsx from "@vitejs/plugin-vue-jsx";
import previewSfcCore from "@vitepress-preview-sfc/core";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "vitepress-preview-sfc",
	description: "vitepress-preview-sfc",
	base: "/vitepress-preview-sfc/",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Guide", link: "/guide" }
		],

		sidebar: [
			{
				text: "Guide",
				items: [
					{ text: "Guide", link: "/guide" },
					{ text: "Preview", link: "/preview" }
				]
			}
		],

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/xiaoxustudio/vitepress-preview-sfc"
			}
		],
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2025-present Xuran "
		}
	},
	vite: {
		plugins: [VueJsx()]
	},
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, { alias: "PreView" });
		}
	}
});
