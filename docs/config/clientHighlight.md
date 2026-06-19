# Client Highlight

`clientHighlight` skips build-time syntax highlighting and sends raw source code to the browser, significantly speeding up the dev server startup and build for pages with many SFC previews.

## Usage

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, { clientHighlight: true });
		}
	}
});
```

## How it works

When `clientHighlight: true`:

1. **Build-time**: The plugin reads SFC files and extracts their code, but **skips** the `highlight()` call (shiki). The raw source code is sent to the browser inside a `<pre><code>` slot.
2. **Browser**: The ViewSfc component renders the code as-is inside a `<pre><code class="language-xxx">` block without syntax coloring.

### Comparison

| Mode                               | Build/Dev Time                       | Code Appearance       | Dependencies                   |
| ---------------------------------- | ------------------------------------ | --------------------- | ------------------------------ |
| `clientHighlight: false` (default) | Slower — shiki highlights every file | Syntax-colored code   | shiki (bundled with VitePress) |
| `clientHighlight: true`            | Fast — no highlighting               | Plain monospaced text | None                           |

## Combining with client-side highlighters

Since the raw code is rendered in a standard `<pre><code>` element, you can add your own client-side syntax highlighter (e.g., `highlight.js`) in your theme:

```ts
// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import { onMounted } from "vue";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		onMounted(async () => {
			const hljs = await import("highlight.js");
			document
				.querySelectorAll("pre code[class*='language-']")
				.forEach((el) => {
					hljs.default.highlightElement(el as HTMLElement);
				});
		});
	}
};
```

## When to enable

- Pages with **10+ SFC previews** where build/dev time is a concern
- You only need the code for reference and don't require syntax coloring
- You prefer to apply highlighting client-side with your own setup

## When to leave disabled

- You rely on shiki's accurate syntax highlighting
- Most pages have only 1-2 previews (build time impact is negligible)
- The code view is a primary feature and needs to look polished out of the box
