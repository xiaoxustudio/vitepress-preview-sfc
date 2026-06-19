# 客户端代码高亮

`clientHighlight` 可以跳过构建时的语法高亮，将原始源代码直接发送到浏览器，显著加快含大量 SFC 预览页面的 dev 启动和构建速度。

## 用法

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

## 工作原理

当 `clientHighlight: true` 时：

1. **构建时**：插件读取 SFC 文件并提取代码，但**跳过** `highlight()` 调用（shiki）。原始源代码通过 `<pre><code>` 插槽直接送入浏览器。
2. **浏览器**：ViewSfc 组件将代码原样渲染到 `<pre><code class="language-xxx">` 中，不进行语法着色。

### 对比

| 模式                             | 构建/Dev 耗时             | 代码外观 | 依赖                    |
| -------------------------------- | ------------------------- | -------- | ----------------------- |
| `clientHighlight: false`（默认） | 较慢 — shiki 高亮每个文件 | 语法着色 | shiki（VitePress 内置） |
| `clientHighlight: true`          | 快 — 无需高亮             | 纯文本   | 无                      |

## 搭配客户端高亮器

由于代码以标准 `<pre><code>` 渲染，你可以自行引入客户端语法高亮器（如 `highlight.js`）：

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

## 何时启用

- 页面包含 **10 个以上 SFC 预览**，构建/dev 时间成为瓶颈
- 只需展示代码内容，不需要语法着色
- 你希望自行管理客户端高亮方案

## 何时保持默认

- 依赖 shiki 准确的语法高亮效果
- 大多数页面只有 1-2 个预览（构建耗时影响可忽略）
- 代码查看是主要功能，需要开箱即用的美观效果
