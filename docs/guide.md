# Getting Started

## Overview

`vitepress-preview-sfc` is a VitePress plugin that lets you embed live Vue Single File Component (SFC) previews directly in your Markdown content. It reads `.vue`, `.tsx`, `.jsx` files from your project, renders them inline, and displays the source code with syntax highlighting.

The project consists of two packages:

- **`@vitepress-preview-sfc/core`** — A markdown-it plugin that parses `<ViewSfc>` tags and `:::` containers in Markdown
- **`@vitepress-preview-sfc/components`** — Vue components that render the preview UI (preview area, code viewer, toolbar)

## Installation

```bash
npm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
# or
pnpm add @vitepress-preview-sfc/core @vitepress-preview-sfc/components
```

## Prerequisites: code highlighting

The plugin relies on VitePress's `markdown.highlight` (typically powered by shiki) for syntax highlighting. You should configure a highlight function in your VitePress config. For example, using `@shikijs/markdown-it`:

```ts
// .vitepress/config.mts
import Shiki from "@shikijs/markdown-it";

const shikiPromise = Shiki({
	themes: { light: "vitesse-light", dark: "vitesse-dark" },
	langs: ["vue", "tsx", "js", "ts", "json", "md", "bash"]
});
```

## Basic Setup

### Step 1: Register the markdown-it plugin

```ts
// .vitepress/config.mts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	markdown: {
		config: async (md) => {
			md.use(await shikiPromise);
			md.use(previewSfcCore, {
				// options (optional)
			});
		}
	}
});
```

### Step 2: Register the Vue component

```ts
// .vitepress/theme/index.ts
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ViewSfc from "@vitepress-preview-sfc/components";
import "@vitepress-preview-sfc/components/dist/view-sfc.css";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("ViewSfc", ViewSfc);
	}
} satisfies Theme;
```

> **Note:** The tag name you register in `app.component()` must match the `alias` you configure in the markdown-it plugin. Default is `"ViewSfc"`.

## Usage in Markdown

### Inline tag syntax

Use an HTML-like tag directly in your Markdown:

```md
<ViewSfc src="./components/button.vue" title="My Button" description="A reusable button component"></ViewSfc>
```

You can also use the self-closing form:

```md
<ViewSfc src="./components/button.vue" />
```

### Container syntax

Alternatively, use the fenced container syntax for better readability with many attributes:

```md
:::ViewSfc
src=./components/button.vue
title=My Button
description=A reusable button component
:::
```

## Next Steps

- Browse the [Examples](./preview) page to see different usage patterns
- Check the [API Reference](./api) for all available options
- Learn how to [Customize](./customization) styles, buttons, and components
- Explore configuration options: [alias](./config/alias), [resolveAlias](./config/resolveAlias), [codeViewUseSlot](./config/codeViewUseSlot), [clientHighlight](./config/clientHighlight)
