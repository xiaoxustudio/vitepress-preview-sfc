# @vitepress-preview-sfc/components

this is vue compoents of the plugin.

## Install

```bash
npm install @vitepress-preview-sfc/components
```

## Usage

add `ViewSfc` component

```ts
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
