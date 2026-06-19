# 示例

本页面展示了各种使用模式。当前页面使用了 `@shikijs/markdown-it` 和 `@shikijs/vitepress-twoslash` 进行语法高亮。

## 基本渲染

渲染单个 Vue SFC 组件：

<ViewSfc src="../components/button.ts.vue" title="Vue SFC" description="一个 TypeScript Vue 组件" />

```md
<ViewSfc src="../components/button.ts.vue" title="Vue SFC" description="一个 TypeScript Vue 组件"></ViewSfc>
```

## 空占位符

渲染时不指定源文件（可用作占位符）：

<ViewSfc src="" description="这是一个空组件" />

```md
<ViewSfc src="" description="这是一个空组件" />
```

## JSX / TSX 组件

`.tsx` 和 `.jsx` 文件同样支持：

<ViewSfc src="../components/react.tsx" title="JSX 组件" description="一个 JSX 渲染函数组件"></ViewSfc>

```md
<ViewSfc src="../components/react.tsx" title="JSX 组件" description="一个 JSX 渲染函数组件"></ViewSfc>
```

## 多文件组件（花括号展开）

使用花括号 `{...}` 语法在一个标签中引用多个文件。当同一组件有多种实现时（如 TypeScript + JavaScript）非常有用。

<PreView src="../components/button.{ts,js}.vue" title="多文件" description="TS + JS 双版本预览"></PreView>

```md
<PreView src="../components/button.{ts,js}.vue" title="多文件" description="TS + JS 双版本预览"></PreView>
```

多个花括号组可以组合使用。例如，`{a,b}/{c,d}.vue` 会展开为 `a/c.vue`、`a/d.vue`、`b/c.vue`、`b/d.vue`。

## 使用 resolveAlias

配置 `resolveAlias` 后，可以使用简短的前缀路径：

<ViewSfc src="@@/button.vue" title="resolveAlias" description="使用 @@/ 别名指向主题目录" />

```md
<ViewSfc src="@@/button.vue" title="resolveAlias" description="使用 @@/ 别名"></ViewSfc>
```

详见 [resolveAlias 文档](./config/resolveAlias)。

## 懒加载

懒加载**默认启用** — 延迟渲染直到组件滚动到视口附近。首屏内容可使用 `:lazy="false"` 关闭：

```md
<ViewSfc :lazy="false" src="../components/c-button.vue" />
```

<ViewSfc src="../components/c-button.vue" title="懒加载" description="仅在可见时渲染" />

详见 [懒加载文档](./config/lazy)。

## 容器语法

使用 `:::` 容器作为内联标签的替代方案：

```md
:::ViewSfc
src=../components/c-button.vue
title=容器渲染
description=使用容器语法渲染
:::
```

渲染为：

:::ViewSfc
src=../components/c-button.vue
title=容器渲染
description=使用容器语法渲染
:::

容器属性解析为 `key=value` 对，每行一个。支持引号值（`"..."` 或 `'...'`）和裸单词（转换为 `key="true"`）。

## 自定义别名

如果你配置了自定义别名（如 `"PreView"`），可以像使用其他标签一样使用它：

<PreView src="../components/button.ts.vue" title="自定义别名" description="使用 PreView 别名渲染"></PreView>

```md
<PreView src="../components/button.ts.vue" title="自定义别名" description="使用 PreView 别名渲染"></PreView>
```

详见 [alias 文档](./config/alias)。
