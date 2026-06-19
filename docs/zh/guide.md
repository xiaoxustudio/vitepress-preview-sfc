# 快速开始

## 概述

`vitepress-preview-sfc` 是一个 VitePress 插件，让你可以在 Markdown 内容中直接嵌入 Vue 单文件组件（SFC）的实时预览。它会读取项目中的 `.vue`、`.tsx`、`.jsx` 文件，内联渲染它们，并显示带有语法高亮的源代码。

项目由两个包组成：

- **`@vitepress-preview-sfc/core`** — markdown-it 插件，解析 Markdown 中的 `<ViewSfc>` 标签和 `:::` 容器
- **`@vitepress-preview-sfc/components`** — Vue 组件，渲染预览界面（预览区域、代码查看器、工具栏）

## 安装

```bash
npm install @vitepress-preview-sfc/core @vitepress-preview-sfc/components
# 或
pnpm add @vitepress-preview-sfc/core @vitepress-preview-sfc/components
```

## 前置条件：代码高亮

插件依赖 VitePress 的 `markdown.highlight`（通常由 shiki 提供）进行语法高亮。你需要在 VitePress 配置中配置高亮函数。例如，使用 `@shikijs/markdown-it`：

```ts
// .vitepress/config.mts
import Shiki from "@shikijs/markdown-it";

const shikiPromise = Shiki({
	themes: { light: "vitesse-light", dark: "vitesse-dark" },
	langs: ["vue", "tsx", "js", "ts", "json", "md", "bash"]
});
```

## 基本设置

### 第一步：注册 markdown-it 插件

```ts
// .vitepress/config.mts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	markdown: {
		config: async (md) => {
			md.use(await shikiPromise);
			md.use(previewSfcCore, {
				// 选项（可选）
			});
		}
	}
});
```

### 第二步：注册 Vue 组件

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

> **注意：** 在 `app.component()` 中注册的标签名必须与 markdown-it 插件中配置的 `alias` 一致。默认为 `"ViewSfc"`。

## 在 Markdown 中使用

### 内联标签语法

直接在 Markdown 中使用类似 HTML 的标签：

```md
<ViewSfc src="./components/button.vue" title="我的按钮" description="一个可复用的按钮组件"></ViewSfc>
```

也可以使用自闭合形式：

```md
<ViewSfc src="./components/button.vue" />
```

### 容器语法

或者使用围栏容器语法，在属性较多时更易读：

```md
:::ViewSfc
src=./components/button.vue
title=我的按钮
description=一个可复用的按钮组件
:::
```

## 下一步

- 查看[示例](./preview)页面，了解不同的使用模式
- 查看 [API 参考](./api)了解所有可用选项
- 了解如何[自定义](./customization)样式、按钮和组件
- 探索配置选项：[alias](./config/alias)、[resolveAlias](./config/resolveAlias)、[codeViewUseSlot](./config/codeViewUseSlot)、[clientHighlight](./config/clientHighlight)
