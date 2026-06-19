# lazy / 懒加载

`lazy` **默认开启**。它会延迟渲染预览组件直到滚动到视口附近，从而提升含多个 SFC 预览的页面加载性能。

## 用法

```md
<ViewSfc src="./components/button.vue"></ViewSfc>
```

如需对特定组件禁用懒加载（如首屏内容）：

```md
<ViewSfc :lazy="false" src="./components/hero.vue"></ViewSfc>
```

## 工作原理

组件使用 `IntersectionObserver`（200px root margin）。预览区域会显示一个占位符（最小高度 60px），直到用户滚动到距离组件 200px 范围内。所有组件共享同一个 Observer 实例，更高效。

## 何时禁用

- 位于首屏、需要立即渲染的组件
- 页面上只有一个预览组件
