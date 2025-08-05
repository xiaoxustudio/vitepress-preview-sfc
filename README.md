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

| Package                                                  | Version                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [@vitepress-preview-sfc/components](packages/components) | ![component version](https://badgen.net/npm/v/@vitepress-preview-sfc/components) |
| [@vitepress-preview-sfc/core](packages/core)             | ![core version](https://badgen.net/npm/v/@vitepress-preview-sfc/core)            |

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

## Configuration

| Name    | Type               | Default | Description                             |
| ------- | ------------------ | ------- | --------------------------------------- |
| `alias` | string or string[] | -       | ViewSfc Alias , You Can add Other Alias |

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
			md.use(previewSfcCore, { alias: ["Preview"] });
		}
	}
});
```

and `Preview` 、 `ViewSfc` will both be used as preview components for parsing.

## Props

### `<ViewSfc />`

#### Props

| Name            | Type         | Default     | Description                                                   |
| --------------- | ------------ | ----------- | ------------------------------------------------------------- |
| `src`           | string       | -           | Vue SFC path, required                                        |
| `code`          | string       | -           | Vue SFC code (Plugin auto)                                    |
| `htmlCode`      | string       | -           | Vue SFC html code (Plugin auto)                               |
| `title`         | string       | Title       | Title of the component                                        |
| `description`   | string       | Description | Description of the component                                  |
| `buttonGroup`   | ViewSfcBtn[] | -           | Button group of the component (default `collapse`,`copy` btn) |
| `extension`     | string       | -           | Extension of the component (Plugin auto)                      |
| `file`          | string       | -           | SFC file name (Plugin auto)                                   |
| `markdownFile`  | string       | -           | Current MarknDown file name (Plugin auto)                     |
| `markdownTitle` | string       | -           | Current MarknDown Title (Plugin auto)                         |

#### ViewSfcBtn

| Name    | Type            | Default | Description          |
| ------- | --------------- | ------- | -------------------- |
| key     | string          | -       | Button key           |
| title   | vnode or string | -       | Button title or icon |
| onClick | () => void      | -       | Button click event   |

## Custom component

You can custom your component by extending `ViewSfc` component

See `docs/.vitepress/theme/preview.vue` for more details

a simple example, include Add button, replace text, etc.

or see [./packages/components/README.md](./packages/components/README.md) for more details

## License

[MIT](./LICENSE)
