# @vitepress-preview-sfc/components

this is vue compoents of the plugin.

## Install

```bash
npm install @vitepress-preview-sfc/components
```

## Usage

add `ViewSfc` component

```ts
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ViewSfc from "@vitepress-preview-sfc/components";
import "@vitepress-preview-sfc/components/dist/view-sfc.css";

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("ViewSfc", ViewSfc);
	}
} satisfies Theme;
```

### ViewSfcConfig

| name            | type                      | default          | description                                           |
| --------------- | ------------------------- | ---------------- | ----------------------------------------------------- |
| collapseText    | Ref<string>               | 收起             | Fold button text                                      |
| copyTextSuccess | Ref<string>               | 复制成功         | Success message for copy operation                    |
| copyTextError   | Ref<string>               | 复制失败         | Copy Failure Prompt Text                              |
| toast           | shallowRef<Vue Component> | ToastComponent   | Copy the ToastSFC of the message , you can replace it |
| tooltip         | shallowRef<Vue Component> | TooltipComponent | The hover component of the button                     |

how to change the config?

we provide a symbol to inject the config (`ViewSfcTagSymbol`)

We used the `inject` function to obtain the passed-in value

It is worth noting that if no value is passed, the default `ViewSfcConfig` will be used

You can intercept it and modify it to achieve the effect you desire

Just like this:

```ts
// xxx.vue (your component)
import {
	ViewSfcConfig,
	ViewSfcTagSymbol
} from "@vitepress-preview-sfc/components";
const config = inject(ViewSfcTagSymbol, ViewSfcConfig);

config.collapseText.value = "xxxx";
// ... more
```
