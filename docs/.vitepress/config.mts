import { defineConfig } from "vitepress";
import VueJsx from "@vitejs/plugin-vue-jsx";
import previewSfcCore from "@vitepress-preview-sfc/core";
import path from "path";
import Shiki from "@shikijs/markdown-it";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";

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
			},
			{
				text: "Config",
				link: "/config",
				items: [
					{ text: "alias", link: "/config/alias" },
					{ text: "resolveAlias", link: "/config/resolveAlias" }
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
		config: async (md) => {
			md.use(
				await Shiki({
					themes: {
						light: "vitesse-light",
						dark: "vitesse-dark"
					},
					transformers: [
						transformerTwoslash({
							filter(lang) {
								return ["vue", "tsx"].includes(lang);
							}
						})
					], // 加载类型定义插件
					langs: ["vue", "tsx", "bash", "js", "ts", "json"]
				})
			);
			md.use(previewSfcCore, {
				alias: "PreView",
				resolveAlias: {
					"@/": path.resolve(__dirname, "../components"),
					"@@/": path.resolve(__dirname, "./theme")
				},
				codeViewUseSlot: true // 使用插槽展示代码而不是html字符串
			});
		}
	}
});
