# Lazy Loading

`lazy` is **enabled by default**. It defers rendering of the preview component until it is near the viewport, improving page load performance when multiple SFC previews exist on a single page.

## Usage

```md
<ViewSfc src="./components/button.vue"></ViewSfc>
```

To disable lazy loading for a specific component (e.g., above-the-fold content):

```md
<ViewSfc :lazy="false" src="./components/hero.vue"></ViewSfc>
```

## How it works

The component uses `IntersectionObserver` with a 200px root margin. The preview area renders a placeholder (60px minimal height) until the user scrolls within 200px of the component. Once visible, the component renders fully. A shared observer instance is used across all components for efficiency.

## When to disable

- Components above the fold that should render immediately
- A single preview on the page
