# Install

```bash
npm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
# or pnpm
pnpm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
```

# Usege

Registering plugins in `.vitepress/config.mts`

```typescript
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	..., // your config
	markdown: {
		config: md => {
			md.use(previewSfcCore);
		},
	},
});

```

Register the plugin in `.vitepress/config.mts`, and import the preview component in `.vitepress/theme/index.ts`

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
