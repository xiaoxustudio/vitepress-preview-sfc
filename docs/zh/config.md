# 配置

VitePress Preview SFC 的配置分为插件核心配置（`IConfig`）和组件配置（`ViewSfcConfig`）。

## 插件选项 (core)

```ts
export interface IConfig {
	alias: string | string[];
	resolveAlias?: string | Record<string, string>;
	codeViewUseSlot?: boolean;
	clientHighlight?: boolean;
}
```

| 选项              | 类型                               | 说明                                   |
| ----------------- | ---------------------------------- | -------------------------------------- |
| `alias`           | `string \| string[]`               | 自定义组件标签名（默认：`"ViewSfc"`）  |
| `resolveAlias`    | `string \| Record<string, string>` | 组件源文件路径解析别名                 |
| `codeViewUseSlot` | `boolean`                          | 使用插槽代替 `v-html` 渲染代码区域     |
| `clientHighlight` | `boolean`                          | 跳过构建时高亮，在浏览器端渲染原始代码 |

### 子页面

- [alias](./config/alias) — 自定义组件标签名
- [resolveAlias](./config/resolveAlias) — 路径解析
- [codeViewUseSlot](./config/codeViewUseSlot) — 插槽式代码渲染
- [clientHighlight](./config/clientHighlight) — 客户端代码渲染，提速构建

## 组件选项 (ViewSfc props)

| 属性              | 类型           | 默认值  | 说明                                         |
| ----------------- | -------------- | ------- | -------------------------------------------- |
| `title`           | `string`       | `""`    | 组件标题                                     |
| `description`     | `string`       | `""`    | 组件描述（支持 HTML）                        |
| `src`             | `string`       | `""`    | 源文件路径                                   |
| `code`            | `string`       | `""`    | 原始源代码                                   |
| `htmlCode`        | `string`       | `""`    | 高亮后的 HTML 代码                           |
| `extension`       | `string`       | `""`    | 文件扩展名标签                               |
| `lazy`            | `boolean`      | `true`  | 启用 IntersectionObserver 懒加载（默认开启） |
| `buttonGroup`     | `ViewSfcBtn[]` | `[]`    | 自定义操作按钮                               |
| `clientHighlight` | `boolean`      | `false` | 跳过构建时高亮，在浏览器端渲染原始代码       |

### 子页面

- [i18n / 国际化](./config/i18n) — 内置国际化支持
- [lazy / 懒加载](./config/lazy) — 性能优化懒加载
- [clientHighlight](./config/clientHighlight) — 客户端代码高亮
