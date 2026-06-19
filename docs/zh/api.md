# API 参考

## 插件选项 (IConfig)

在 VitePress 配置中调用 `md.use(previewSfcCore, options)` 时传入这些选项。

```ts
interface IConfig {
	alias?: string | string[];
	resolveAlias?: string | Record<string, string>;
	codeViewUseSlot?: boolean;
	clientHighlight?: boolean;
}
```

| 选项              | 类型                               | 默认值      | 说明                                                             |
| ----------------- | ---------------------------------- | ----------- | ---------------------------------------------------------------- |
| `alias`           | `string \| string[]`               | `"ViewSfc"` | 自定义组件标签名称。`"ViewSfc"` 始终被包含在内。                 |
| `resolveAlias`    | `string \| Record<string, string>` | `env.path`  | `src` 属性的路径解析。字符串设置基础目录；对象将前缀映射到目录。 |
| `codeViewUseSlot` | `boolean`                          | `false`     | 启用后，代码视图通过具名插槽渲染，而不是 `v-html`。              |
| `clientHighlight` | `boolean`                          | `false`     | 跳过构建时语法高亮，将原始代码发送到浏览器。                     |

详见：[alias](./config/alias)、[resolveAlias](./config/resolveAlias)、[codeViewUseSlot](./config/codeViewUseSlot)、[clientHighlight](./config/clientHighlight)

---

## 组件属性 (ViewSfcProps)

```ts
interface ViewSfcProps {
	title?: string;
	description?: string;
	src?: string;
	code?: string;
	htmlCode?: string;
	extension?: string;
	lazy?: boolean;
	buttonGroup?: ViewSfcBtn[];
	sfcs?: SFCMeta[];
}
```

| 属性          | 类型           | 默认值 | 说明                                                        |
| ------------- | -------------- | ------ | ----------------------------------------------------------- |
| `title`       | `string`       | `""`   | 组件标题，渲染在代码区域上方。                              |
| `description` | `string`       | `""`   | 组件描述，支持 HTML。                                       |
| `src`         | `string`       | `""`   | 源文件路径。支持花括号展开语法（`{a,b}.vue`）。             |
| `code`        | `string`       | `""`   | 原始源代码。由插件自动填充。                                |
| `htmlCode`    | `string`       | `""`   | 语法高亮后的 HTML。当 `clientHighlight: false` 时自动填充。 |
| `extension`   | `string`       | `""`   | 文件扩展名徽标（如 `"vue"`、`"tsx"`）。                     |
| `lazy`        | `boolean`      | `true` | 启用基于 IntersectionObserver 的懒加载。                    |
| `buttonGroup` | `ViewSfcBtn[]` | `[]`   | 自定义操作按钮，追加到工具栏。                              |
| `sfcs`        | `SFCMeta[]`    | —      | SFC 元数据数组。支持多文件时由插件自动填充。                |

标记为"自动填充"的属性由 markdown-it 插件在构建时填充。在 Markdown 中使用标签时无需手动设置。

---

## 组件插槽

| 插槽               | 作用域                    | 说明                                                              |
| ------------------ | ------------------------- | ----------------------------------------------------------------- |
| `preview`          | —                         | 替换整个预览区域。用于渲染动态组件或自定义布局。                  |
| `title`            | `{ title: string }`       | 自定义标题渲染。                                                  |
| `description`      | `{ description: string }` | 自定义描述渲染。                                                  |
| `codeView`         | —                         | 自定义代码视图输出。替换默认的高亮 HTML 或原始代码。              |
| `codeView[组件名]` | —                         | 每个组件独立的代码视图插槽。仅在 `codeViewUseSlot: true` 时可用。 |

### 代码渲染优先级

1. **插槽 `codeView<组件名>`** — 每个组件独立的插槽（仅 `codeViewUseSlot: true` 时）
2. **插槽 `codeView`** — 通用代码视图插槽
3. **`v-html="htmlCode"`** — 构建时高亮 HTML（`clientHighlight: false` 时）
4. **`<pre><code>`** — 原始源代码回退（纯文本）

---

## 组件事件

```ts
interface ViewSfcEmits {
	(e: "codeActive", state: boolean): void;
}
```

| 事件         | 载荷      | 说明                                                     |
| ------------ | --------- | -------------------------------------------------------- |
| `codeActive` | `boolean` | 代码区域展开/收起时触发。`true` = 展开，`false` = 收起。 |

---

## 组件暴露的方法

通过模板 ref 访问：

```html
<ViewSfc ref="vsfc" />
```

```ts
const vsfc = ref<InstanceType<typeof ViewSfc> | null>(null);
```

| 暴露的成员      | 类型                        | 说明                                                              |
| --------------- | --------------------------- | ----------------------------------------------------------------- |
| `btnGroup`      | `ComputedRef<ViewSfcBtn[]>` | 完整的计算按钮数组（自定义 + 默认代码/复制按钮）。                |
| `onCopy`        | `() => void`                | 编程式触发复制操作。                                              |
| `onCollapse`    | `() => void`                | 编程式切换代码区域。                                              |
| `customButtons` | `Ref<ViewSfcBtn[]>`         | 可在运行时推入自定义按钮的数组，按钮插入在默认代码/复制按钮之前。 |

---

## 类型定义

### ViewSfcBtn

```ts
interface ViewSfcBtn {
	key: string;
	title: VNode | string;
	tip?: string;
	onClick: () => void;
}
```

### SFCMeta

```ts
interface SFCMeta {
	absoluteSrc: string;
	code: string;
	componentName: string;
	htmlCode: string;
	sfc?: DefineComponent;
	sfcSlot?: DefineComponent;
	src: string;
	suffixName: string;
}
```

### SFCPrototype

```ts
interface SFCPrototype {
	code: string;
	description: string;
	extension: string;
	file: string;
	markdownFile: string;
	markdownTitle: string;
	sfcs: SFCMeta[];
	src: string;
	title: string;
	CompName?: string;
	refName?: string;
}
```

### LocaleMessages

```ts
interface LocaleMessages {
	collapseText: string;
	copyTextSuccess: string;
	copyTextError: string;
	showCodeText: string;
	copyCodeText: string;
	accessibility: {
		btnGroupLabel: string;
		codeRegionLabel: string;
		collapseBtnLabel: string;
	};
}
```

---

## 包导出

### 来自 `@vitepress-preview-sfc/components`

```ts
import ViewSfc from "@vitepress-preview-sfc/components";
```

| 导出               | 类型                  | 说明                                                    |
| ------------------ | --------------------- | ------------------------------------------------------- |
| `default`          | `Component`           | 主要的 `ViewSfc` 预览组件。                             |
| `ViewSfcConfigFn`  | `() => ViewSfcConfig` | 创建全新配置实例的工厂函数。                            |
| `ViewSfcConfig`    | `ViewSfcConfig`       | 默认全局配置实例。                                      |
| `ViewSfcTagSymbol` | `Symbol`              | 用于 `provide/inject` 的注入 key。                      |
| `ToastComponent`   | `Component`           | 默认的 Toast 通知组件。                                 |
| `TooltipComponent` | `Component`           | 默认的 Tooltip 组件。                                   |
| `defaultLocales`   | `LocaleDef`           | 内置语言包（`en`、`zh`、`zhTW`）。                      |
| `detectLocale`     | `() => string`        | 从 `<html lang>` 或 `navigator.language` 自动检测语言。 |

### 来自 `@vitepress-preview-sfc/core`

```ts
import previewSfcCore from "@vitepress-preview-sfc/core";
```

| 导出           | 类型                                                   | 说明                   |
| -------------- | ------------------------------------------------------ | ---------------------- |
| `default`      | `(md: MarkdownIt, options?: Partial<IConfig>) => void` | markdown-it 插件函数。 |
| `SFCMeta`      | `type`                                                 | SFC 元数据接口。       |
| `SFCPrototype` | `type`                                                 | 解析后的组件属性接口。 |
| `IConfig`      | `type`                                                 | 插件选项接口。         |
