# 配置选项

VitePress Preview SFC 的配置由 IConfig 接口定义，该接口提供了两个主要选项来自定义插件的行为。这些选项允许您控制组件别名和路径解析，使插件更容易集成到您现有的工作流程中。

```ts
export interface IConfig {
	alias: string | string[];
	resolveAlias?: string | Record<string, string>;
}
```

alias 选项是自定义预览组件在 Markdown 文件中如何被识别的主要方法。默认情况下，插件使用 "ViewSfc" 作为组件名称，但您可以通过添加额外的别名来扩展此设置，以匹配您项目的命名约定。

默认情况下，插件将 ViewSfc 注册为组件别名。这意味着您可以在 Markdown 中使用以下任一语法：

```md
<ViewSfc src="./components/button.vue"></ViewSfc>
```

或者使用容器语法：

```md
:::ViewSfc
src=./components/button.vue
:::
```

其他配置可以在以下内容中找到。

### 示例

以下是在 VitePress 项目中配置插件的简单示例：

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";
import path from "path";

export default defineConfig({
	// ...其他配置选项
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, {
				// 匹配组件名称
				alias: ["Preview", "Demo", "Example"],

				// 解析别名
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
