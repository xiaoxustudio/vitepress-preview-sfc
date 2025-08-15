# Example preview

The current page combines the use of `@shikijs/markdown-it` and `@shikijs/vitepress-twoslash`.

Render Empty
<ViewSfc src="" description="this is a `empty` component"/>

Render Vue SFC component
<ViewSfc src="./components/button.ts.vue" title="ViewSfc Render" description="a component description" />

Render JSX SFC component
<ViewSfc src="./components/react.tsx" title="JSX Render" description="a component description"></ViewSfc>

Custom component rendering
<PreView src="./components/button.{ts,js}.vue" title="Custom component rendering" description="a component description"></PreView>

resolveAlias
<ViewSfc src="@@/button.vue" title="ViewSfc Render" description="a component description" />

## or use `:::` tag

```
:::ViewSfc
src=./components/c-button.vue
title=ViewSfc Container Render
description=a component description with container
:::
```

to:

:::ViewSfc
src=./components/c-button.vue
title=ViewSfc Container Render
description=a component description with container
:::
