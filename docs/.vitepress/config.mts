import { defineConfig } from "vitepress";
import VueJsx from "@vitejs/plugin-vue-jsx";
import previewSfcCore from "@vitepress-preview-sfc/core";
import path from "path";
import type { PluginOption } from "vite";
import Shiki from "@shikijs/markdown-it";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";

const shikiPromise = Shiki({
	themes: {
		light: "vitesse-light",
		dark: "vitesse-dark"
	},
	transformers: [
		transformerTwoslash({
			filter(lang: string) {
				return ["vue", "tsx"].includes(lang);
			}
		})
	],
	langs: ["vue", "tsx", "bash", "js", "ts", "json", "md"]
});

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
					{ text: "Getting Started", link: "/guide" },
					{ text: "Examples", link: "/preview" },
					{ text: "API Reference", link: "/api" },
					{ text: "Customization", link: "/customization" }
				]
			},
			{
				text: "Config",
				link: "/config",
				items: [
					{ text: "alias", link: "/config/alias" },
					{ text: "resolveAlias", link: "/config/resolveAlias" },
					{
						text: "codeViewUseSlot",
						link: "/config/codeViewUseSlot"
					},
					{ text: "i18n / Locale", link: "/config/i18n" },
					{ text: "lazy", link: "/config/lazy" },
					{ text: "clientHighlight", link: "/config/clientHighlight" }
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
		/* @TODO Vite8 和 当前的VitePress 类型不兼容 */
		plugins: [VueJsx()] as any,
		css: {
			preprocessorOptions: {
				scss: { api: "modern-compiler" }
			}
		}
	},
	markdown: {
		config: async (md) => {
			md.use(await shikiPromise);
			md.use(previewSfcCore, {
				alias: "PreView",
				resolveAlias: {
					"@/": path.resolve(__dirname, "../components"),
					"@@/": path.resolve(__dirname, "./theme")
				},
				codeViewUseSlot: true // 使用插槽展示代码而不是html字符串
			});
		}
	},
	locales: {
		root: {
			label: "English",
			lang: "en"
		},
		zh: {
			label: "简体中文",
			lang: "zh",
			themeConfig: {
				nav: [
					{ text: "首页", link: "/zh/" },
					{ text: "指南", link: "/zh/guide" }
				],
				sidebar: [
					{
						text: "指南",
						items: [
							{ text: "快速开始", link: "/zh/guide" },
							{ text: "示例", link: "/zh/preview" },
							{ text: "API 参考", link: "/zh/api" },
							{ text: "自定义", link: "/zh/customization" }
						]
					},
					{
						text: "配置",
						link: "/zh/config",
						items: [
							{ text: "alias", link: "/zh/config/alias" },
							{
								text: "resolveAlias",
								link: "/zh/config/resolveAlias"
							},
							{
								text: "codeViewUseSlot",
								link: "/zh/config/codeViewUseSlot"
							},
							{
								text: "i18n / 国际化",
								link: "/zh/config/i18n"
							},
							{
								text: "lazy / 懒加载",
								link: "/zh/config/lazy"
							},
							{
								text: "clientHighlight",
								link: "/zh/config/clientHighlight"
							}
						]
					}
				]
			}
		}
	}
});
