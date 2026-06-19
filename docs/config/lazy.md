# Lazy Loading

The `lazy` prop defers rendering of the preview component until it is near the viewport, improving page load performance when multiple SFC previews exist on a single page.

## Usage

```md
<ViewSfc lazy src="./components/button.vue"></ViewSfc>
```

## How it works

When `lazy` is enabled, the component uses `IntersectionObserver` with a 200px root margin. The preview area renders a placeholder (60px minimal height) until the user scrolls within 200px of the component. Once visible, the component renders fully and the observer disconnects.

## When to use

- Pages with 5+ SFC previews
- Complex components with heavy rendering
- Documentation homepages with multiple examples

```md
<!-- Without lazy: all previews render on page load -->

<ViewSfc src="./components/table.vue"></ViewSfc>
<ViewSfc src="./components/chart.vue"></ViewSfc>
<ViewSfc src="./components/form.vue"></ViewSfc>

<!-- With lazy: renders only when scrolled near -->

<ViewSfc lazy src="./components/table.vue"></ViewSfc>
<ViewSfc lazy src="./components/chart.vue"></ViewSfc>
<ViewSfc lazy src="./components/form.vue"></ViewSfc>
```
