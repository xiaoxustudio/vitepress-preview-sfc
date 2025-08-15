# vitepress-preview-sfc

> 一款用于 vitepress 的插件，可预览 Vue SFC
>
> [English](./README.md) | [中文](./README_CN.md)

## 安装

```bash
npm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
# or pnpm
pnpm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
```

## 包

| Package                                                  | Version                                                                                                                                             | Downloads                                                                             |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [@vitepress-preview-sfc/components](packages/components) | [![component version](https://badgen.net/npm/v/@vitepress-preview-sfc/components)](https://www.npmjs.com/package/@vitepress-preview-sfc/components) | ![NPM Downloads](https://img.shields.io/npm/dw/%40vitepress-preview-sfc%2Fcomponents) |
| [@vitepress-preview-sfc/core](packages/core)             | [![core version](https://badgen.net/npm/v/@vitepress-preview-sfc/core)](https://www.npmjs.com/package/@vitepress-preview-sfc/core)                  | ![NPM Downloads](https://img.shields.io/npm/dw/%40vitepress-preview-sfc%2Fcore)       |

## 使用

在 `.vitepress/config.mts`， 添加 `@vitepress-preview-sfc/core` 到 `markdown.config`:

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

添加 `ViewSfc` 组件

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

在 `markdown` 中使用:

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

## 插件配置

| Name              | Type                            | Default  | Description                                                                             |
| ----------------- | ------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `alias`           | string or string[]              | -        | ViewSfc别名，你可以添加其他的别名                                                       |
| `resolveAlias`    | string or Record<string,string> | env.path | 路径别名                                                                                |
| `codeViewUseSlot` | boolean                         | false    | 使用插槽展示代码而不是html字符串,当开启后，会有 `codeView<componentName>`的插槽传入组件 |

默认设置为`ViewSfc`，您不能删除或更改它，但您可以添加一个新的别名。
例如，如果你想使用`Preview`这个别名，你可以这样操作：

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

`Preview`，`ViewSfc`这两个别名都将被用作解析预览组件。

是的，默认会添加 `ViewSfc` 别名

## 组件

### `<ViewSfc />`

#### 属性 (SFCPrototype)

| Name            | Type         | Default     | Description                                        |
| --------------- | ------------ | ----------- | -------------------------------------------------- |
| `src`           | string       | -           | 路径, 可使用`./src/{aaa,bbb}.vue`语法解析多个路径  |
| `code`          | string       | -           | 代码 （自动解析，无需手动输入）,                   |
| `htmlCode`      | string       | -           | 渲染的html （自动解析，无需手动输入）              |
| `title`         | string       | Title       | 标题                                               |
| `description`   | string       | Description | 描述                                               |
| `buttonGroup`   | ViewSfcBtn[] | -           | 按钮组（默认展开、复制按钮）                       |
| `extension`     | string       | -           | 扩展名（自动解析，无需手动输入）                   |
| `sfcs`          | SFCMeta[]    | -           | SFC Meta （自动解析，无需手动输入）                |
| `file`          | string       | -           | SFC 文件名称 （自动解析，无需手动输入）            |
| `markdownFile`  | string       | -           | 当前 MarknDown 文件名称 （自动解析，无需手动输入） |
| `markdownTitle` | string       | -           | 当前 MarknDown 标题 （自动解析，无需手动输入）     |

#### ViewSfcBtn

| Name    | Type            | Default | Description         |
| ------- | --------------- | ------- | ------------------- |
| key     | string          | -       | 按钮 key , required |
| title   | vnode or string | -       | 按钮文本或图标      |
| tip     | string          | -       | tooltip             |
| onClick | () => void      | -       | 点击事件            |

## 自定义组件

您可以通过扩展 `ViewSfc` 组件来定制您的组件。

请查看 `docs/.vitepress/theme/preview.vue` 以获取更多详细信息

包括添加按钮、替换文本等。

或者查看 [./packages/components/README.md](./packages/components/README.md) 获得更多信息

## License

[MIT](./LICENSE)
