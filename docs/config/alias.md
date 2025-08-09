# alias

You can add custom aliases to make the plugin more intuitive for your team. For example, if you prefer to use "Preview" as the component name:

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	// ...other
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, {
				alias: "Preview"
			});
		}
	}
});
```

After completing this configuration, you can use both ViewSfc and Preview simultaneously in Markdown files.

```md
<Preview src="./components/button.vue"></Preview>
```

### Multiple aliases

You can also specify multiple aliases as an array:

```ts
md.use(previewSfcCore, {
	alias: ["Preview", "ComponentDemo", "LiveDemo"]
});
```

This enables you to interchangeably use any of these component names within Markdown files.
