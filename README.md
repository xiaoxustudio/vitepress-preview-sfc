# vitepress-preview-sfc

> A plugin for vitepress to preview Vue SFC
>
> [English](./README.md) | [中文](./README_CN.md)

## Install

```bash
npm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
# or pnpm
pnpm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
```

## Packages

| Package                                                  | Version                                                                                                                                             | Downloads                                                                             |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [@vitepress-preview-sfc/components](packages/components) | [![component version](https://badgen.net/npm/v/@vitepress-preview-sfc/components)](https://www.npmjs.com/package/@vitepress-preview-sfc/components) | ![NPM Downloads](https://img.shields.io/npm/dw/%40vitepress-preview-sfc%2Fcomponents) |
| [@vitepress-preview-sfc/core](packages/core)             | [![core version](https://badgen.net/npm/v/@vitepress-preview-sfc/core)](https://www.npmjs.com/package/@vitepress-preview-sfc/core)                  | ![NPM Downloads](https://img.shields.io/npm/dw/%40vitepress-preview-sfc%2Fcore)       |

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
```

add `ViewSfc` component

```ts
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

and use it in markdown:

```md
<ViewSfc src="Your vue sfc path" [...]></ViewSfc>
```

or

```md
:::ViewSfc
src=xxx
// more props
:::
```

## Configuration

| Name           | Type                            | Default  | Description                             |
| -------------- | ------------------------------- | -------- | --------------------------------------- |
| `alias`        | string or string[]              | -        | ViewSfc Alias , You Can add Other Alias |
| `resolveAlias` | string or Record<string,string> | env.path | Path resolve alias                      |

The default is `ViewSfc`，you can not delete or change it, btn you can add a new alias.

For example, if you want to use `Preview` as an alias for `ViewSfc`, you can do it like this:

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	// ...other config
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, {
				alias: "PreView",
				resolveAlias: {
					"@/": path.resolve(__dirname, "../components"),
					"@@/": path.resolve(__dirname, "./theme")
				}
			});
		}
	}
});
```

and `Preview` 、 `ViewSfc` will both be used as preview components for parsing.

## Props

### `<ViewSfc />`

#### Props (SFCPrototype)

| Name            | Type         | Default     | Description                                                                                 |
| --------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------- |
| `src`           | string       | -           | Vue SFC path, Paths can be parsed for multiple paths using the `./src/{aaa,bbb}.vue` syntax |
| `code`          | string       | -           | Vue SFC code (Plugin auto)                                                                  |
| `htmlCode`      | string       | -           | Vue SFC html code (Plugin auto)                                                             |
| `title`         | string       | Title       | Title of the component                                                                      |
| `description`   | string       | Description | Description of the component                                                                |
| `buttonGroup`   | ViewSfcBtn[] | -           | Button group of the component (default `collapse`,`copy` btn)                               |
| `extension`     | string       | -           | Extension of the component (Plugin auto)                                                    |
| `sfcs`          | SFCMeta[]    | -           | SFC Meta (Plugin auto)                                                                      |
| `file`          | string       | -           | SFC file name (Plugin auto)                                                                 |
| `markdownFile`  | string       | -           | Current MarknDown file name (Plugin auto)                                                   |
| `markdownTitle` | string       | -           | Current MarknDown Title (Plugin auto)                                                       |

#### ViewSfcBtn

| Name    | Type            | Default | Description          |
| ------- | --------------- | ------- | -------------------- |
| key     | string          | -       | Button key           |
| title   | vnode or string | -       | Button title or icon |
| tip     | string          | -       | tooltip              |
| onClick | () => void      | -       | Button click event   |

## Custom component

You can custom your component by extending `ViewSfc` component

See `docs/.vitepress/theme/preview.vue` for more details

a simple example, include Add button, replace text, etc.

or see [./packages/components/README.md](./packages/components/README.md) for more details

## License

[MIT](./LICENSE)
