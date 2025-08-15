import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ViewSfc from "@vitepress-preview-sfc/components";
import "@vitepress-preview-sfc/components/dist/view-sfc.css";
import preview from "./preview.vue";

import TwoslashFloatingVue, {
	FloatingVueConfig
} from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.use(TwoslashFloatingVue, {
			noAutoFocus: true
		} as FloatingVueConfig);
		app.component("ViewSfc", ViewSfc);
		app.component("PreView", preview);
	}
} satisfies Theme;
