# vitepress-preview-sfc

> A plugin for vitepress to preview Vue SFC

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

## Props

### `<ViewSfc />`

#### Props

| Name          | Type         | Default     | Description                             |
| ------------- | ------------ | ----------- | --------------------------------------- |
| `src`         | string       | -           | Vue SFC path, required                  |
| `code`        | string       | -           | Vue SFC code, required                  |
| `htmlCode`    | string       | -           | Vue SFC html code, required             |
| `title`       | string       | Title       | Title of the component, required        |
| `description` | string       | Description | Description of the component, required  |
| `buttonGroup` | ViewSfcBtn[] | -           | Button group of the component, required |
| `extension`   | string       | -           | Extension of the component, required    |

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
