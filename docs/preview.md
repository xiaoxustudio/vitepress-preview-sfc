# Examples

This page demonstrates various usage patterns. It uses `@shikijs/markdown-it` and `@shikijs/vitepress-twoslash` for syntax highlighting.

## Basic rendering

Render a single Vue SFC component:

<ViewSfc src="./components/button.ts.vue" title="Vue SFC" description="A TypeScript Vue component" />

```md
<ViewSfc src="./components/button.ts.vue" title="Vue SFC" description="A TypeScript Vue component"></ViewSfc>
```

## Empty placeholder

Render without a source file (useful as a placeholder):

<ViewSfc src="" description="This is an empty component" />

```md
<ViewSfc src="" description="This is an empty component" />
```

## JSX / TSX components

`.tsx` and `.jsx` files are also supported:

<ViewSfc src="./components/react.tsx" title="JSX Component" description="A JSX render-function component"></ViewSfc>

```md
<ViewSfc src="./components/react.tsx" title="JSX Component" description="A JSX render-function component"></ViewSfc>
```

## Multi-file components (brace expansion)

Use brace `{...}` syntax to reference multiple files from one tag. This is useful when you have multiple implementations of the same component (e.g. TypeScript + JavaScript).

<PreView src="./components/button.{ts,js}.vue" title="Multi-file" description="TS + JS variants in one preview"></PreView>

```md
<PreView src="./components/button.{ts,js}.vue" title="Multi-file" description="TS + JS variants"></PreView>
```

Multiple brace groups can be combined. For example, `{a,b}/{c,d}.vue` expands to `a/c.vue`, `a/d.vue`, `b/c.vue`, `b/d.vue`.

## Using resolveAlias

When you configure `resolveAlias`, you can use short prefix paths:

<ViewSfc src="@@/button.vue" title="resolveAlias" description="Using @@/ alias pointing to theme directory" />

```md
<ViewSfc src="@@/button.vue" title="resolveAlias" description="Using @@/ alias"></ViewSfc>
```

See the [resolveAlias docs](./config/resolveAlias) for configuration details.

## Lazy loading

Lazy loading is **enabled by default** — rendering is deferred until the component scrolls near the viewport. Disable with `:lazy="false"` for above-the-fold content:

```md
<ViewSfc :lazy="false" src="./components/c-button.vue" />
```

<ViewSfc src="./components/c-button.vue" title="Lazy Loaded" description="Only renders when visible" />

See the [lazy loading docs](./config/lazy) for details.

## Container syntax

Use `:::` containers as an alternative to inline tags:

```md
:::ViewSfc
src=./components/c-button.vue
title=Container Render
description=Rendered using the container syntax
:::
```

Renders to:

:::ViewSfc
src=./components/c-button.vue
title=Container Render
description=Rendered using the container syntax
:::

Container attributes are parsed as `key=value` pairs, one per line. Quoted values (`"..."` or `'...'`) and bare words (becoming `key="true"`) are supported.

## Custom alias

If you configured a custom alias (e.g. `"PreView"`), use it like any other tag:

<PreView src="./components/button.ts.vue" title="Custom Alias" description="Rendered with PreView alias"></PreView>

```md
<PreView src="./components/button.ts.vue" title="Custom Alias" description="Rendered with PreView alias"></PreView>
```

See the [alias docs](./config/alias) for configuration.
