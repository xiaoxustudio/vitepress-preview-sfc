# 预览示例

当前页面结合使用了 `@shikijs/markdown-it` 和 `@shikijs/vitepress-twoslash`。

渲染空组件
<ViewSfc src="" description="这是一个`空`组件"/>

渲染 Vue SFC 组件
<ViewSfc src="../components/button.ts.vue" title="ViewSfc 渲染" description="组件描述" />

渲染 JSX SFC 组件
<ViewSfc src="../components/react.tsx" title="JSX 渲染" description="组件描述"></ViewSfc>

自定义组件渲染
<PreView src="../components/button.{ts,js}.vue" title="自定义组件渲染" description="组件描述"></PreView>

resolveAlias
<ViewSfc src="@@/button.vue" title="ViewSfc 渲染" description="组件描述" />

## 或使用 `:::` 标签

```
:::ViewSfc
src=../components/c-button.vue
title=ViewSfc 容器渲染
description=带有容器的组件描述
:::
```

渲染为:

:::ViewSfc
src=../components/c-button.vue
title=ViewSfc 容器渲染
description=带有容器的组件描述
:::
