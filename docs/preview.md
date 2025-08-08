# Example preview

Render Empty
<ViewSfc />

Render Vue SFC component
<ViewSfc src="./components/button.vue" title="ViewSfc Render" description="a component description" />

Render JSX SFC component
<ViewSfc src="./components/react.tsx" title="JSX Render" description="a component description"></ViewSfc>

Custom component rendering
<PreView src="./components/test.vue" title="Custom component rendering" description="a component description"></PreView>

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
