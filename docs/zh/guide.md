# 安装

```bash
npm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
# 或者使用 pnpm
pnpm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
```

# 使用

在 `.vitepress/config.mts` 中注册插件

```typescript
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	..., // 你的其他配置
	markdown: {
		config: md => {
			md.use(previewSfcCore);
		},
	},
});

```

在 `.vitepress/config.mts` 中注册插件，并在 `.vitepress/theme/index.ts` 中导入预览组件

```typescript
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ViewSfc from "@vitepress-preview-sfc/components";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("ViewSfc", ViewSfc);
	}
} satisfies Theme;
```
