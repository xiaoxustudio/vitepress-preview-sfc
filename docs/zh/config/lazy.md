# lazy / 懒加载

`lazy` prop 可以延迟渲染预览组件，直到它滚动到视口附近，从而提升包含多个 SFC 预览的页面加载性能。

## 用法

```md
<ViewSfc lazy src="./components/button.vue"></ViewSfc>
```

## 工作原理

启用 `lazy` 后，组件使用 `IntersectionObserver`（200px root margin）。预览区域会显示一个占位符（最小高度 60px），直到用户滚动到距离组件 200px 范围内。一旦可见，组件完全渲染并断开观察器。

## 适用场景

- 页面包含 5 个以上的 SFC 预览
- 渲染开销较大的复杂组件
- 包含多个示例的文档首页

```md
<!-- 不使用 lazy：所有预览在页面加载时同时渲染 -->

<ViewSfc src="./components/table.vue"></ViewSfc>
<ViewSfc src="./components/chart.vue"></ViewSfc>
<ViewSfc src="./components/form.vue"></ViewSfc>

<!-- 使用 lazy：滚动到附近时才渲染 -->

<ViewSfc lazy src="./components/table.vue"></ViewSfc>
<ViewSfc lazy src="./components/chart.vue"></ViewSfc>
<ViewSfc lazy src="./components/form.vue"></ViewSfc>
```
