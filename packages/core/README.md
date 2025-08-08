# @vitepress-preview-sfc/core

> It is actually a MarkdownIt plugin.

this is the core of the plugin.

## Install

```bash
npm install @vitepress-preview-sfc/core
```

## Usage

in `.vitepress/config.mts`， add `@vitepress-preview-sfc/core` to `markdown.config`:

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	// ...other config
	markdown: {
		config: (md) => {
			md.use(previewSfcCore);
		}
	}
});
``;
```
