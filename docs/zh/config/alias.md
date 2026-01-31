# alias

您可以添加自定义别名，使插件对您的团队更加直观。例如，如果您更喜欢使用 "Preview" 作为组件名称：

```ts
import { defineConfig } from "vitepress";
import previewSfcCore from "@vitepress-preview-sfc/core";

export default defineConfig({
	// ...其他配置
	markdown: {
		config: (md) => {
			md.use(previewSfcCore, {
				alias: "Preview"
			});
		}
	}
});
```

完成此配置后，您可以在 Markdown 文件中同时使用 ViewSfc 和 Preview。

```md
<Preview src="./components/button.vue"></Preview>
```

### 多个别名

您也可以指定多个别名作为数组：

```ts
md.use(previewSfcCore, {
	alias: ["Preview", "ComponentDemo", "LiveDemo"]
});
```

这使您可以在 Markdown 文件中互换使用这些组件名称中的任何一个。
