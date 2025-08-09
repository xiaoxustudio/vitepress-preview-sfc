# Configuration options

The configuration of VitePress Preview SFC is defined by the IConfig interface, which provides two main options to customize the behavior of the plugin. These options allow you to control component aliases and path resolution, making it easier to integrate the plugin into your existing workflow.

```ts
export interface IConfig {
	alias: string | string[];
	resolveAlias?: string | Record<string, string>;
}
```

The alias option is the primary method for customizing how the preview component is recognized in Markdown files. By default, the plugin uses "ViewSfc" as the component name, but you can extend this setting by adding additional aliases to match the naming conventions of your project.

By default, the plugin registers ViewSfc as a component alias. This means that you can use either of the following syntaxes in Markdown:

```md
<ViewSfc src="./components/button.vue"></ViewSfc>
```

Or use container grammar:

```md
:::ViewSfc
src=./components/button.vue
:::
```

Other configurations can be found in the following text.

### End

a simple example of how to configure the plugin in a VitePress project:

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";
import path from "path";

export default defineConfig({
	// ...other configuration options
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, {
				// matching component name
				alias: ["Preview", "Demo", "Example"],

				// resolve alias
				resolveAlias: {
					"@/components": path.resolve(
						__dirname,
						"../src/components"
					),
					"@/ui": path.resolve(__dirname, "../src/ui"),
					"@theme/": path.resolve(__dirname, "./theme")
				}
			});
		}
	}
});
```
