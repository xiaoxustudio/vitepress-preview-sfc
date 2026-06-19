# Customization

Vitepress Preview SFC offers multiple customization points: CSS variables, custom toast/tooltip components, custom buttons, and slot overrides.

## CSS Variables

### `--vp-preview-bg`

Background color of the preview area.

**Default:** `#ffffff`

```css
--vp-preview-bg: #f5f5f5;
```

### `--vp-preview-padding`

Padding inside the preview area.

**Default:** `16px`

```css
--vp-preview-padding: 24px;
```

### `--vp-preview-border`

Border of the preview area.

**Default:** `1px solid #e0e0e0`

```css
--vp-preview-border: 2px dashed #333;
```

### `--vp-code-tabs-bg`

Background color of the code tab bar.

```css
--vp-code-tabs-bg: #f0f0f0;
```

### `--vp-code-tabs-active-color`

Color of the active code tab indicator.

```css
--vp-code-tabs-active-color: #42b883;
```

## Custom Toast Component

You can replace the default toast notification with your own component. The component receives these props:

- `message` — Toast message text
- `type` — `"success"` | `"error"` | `"warning"` | `"info"`
- `position` — `"top-right"` | `"top-left"` | `"bottom-right"` | `"bottom-left"`
- `duration` — Auto-close duration (ms), `<= 0` disables auto-close
- `closable` — Show close button
- `onClick` — Click handler

Register it in your theme:

```ts
import {
	ViewSfcConfigFn,
	ViewSfcTagSymbol
} from "@vitepress-preview-sfc/components";
import MyToast from "./MyToast.vue";

const config = ViewSfcConfigFn();
config.toast.value = MyToast;

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component("ViewSfc", ViewSfc);
		app.provide(ViewSfcTagSymbol, config);
	}
};
```

## Custom Tooltip Component

Similarly, replace the default tooltip:

```ts
const config = ViewSfcConfigFn();
config.tooltip.value = MyTooltip;
```

The tooltip component receives these props:

| Prop        | Type      | Default | Description                                 |
| ----------- | --------- | ------- | ------------------------------------------- |
| `content`   | `string`  | `""`    | Tooltip text                                |
| `placement` | `string`  | `"top"` | `"top"`, `"bottom"`, `"left"`, or `"right"` |
| `delay`     | `number`  | `150`   | Show/hide delay in ms                       |
| `disabled`  | `boolean` | `false` | Disable tooltip                             |

## Custom Buttons

### Static buttons via `buttonGroup` prop

```md
<ViewSfc src="./button.vue" :buttonGroup="[{ key: 'alert', title: 'Info', onClick: () => alert('hi') }]"></ViewSfc>
```

### Dynamic buttons via `customButtons` expose

<div v-pre>

```html
<template>
	<ViewSfc ref="vsfc" src="./button.vue" />
</template>

<script setup>
	import { ref, onMounted } from "vue";

	const vsfc = ref(null);

	onMounted(() => {
		vsfc.value?.customButtons.push({
			key: "locale-toggle",
			title: "Switch language",
			onClick() {
				// toggle locale
			}
		});
	});
</script>
```

</div>

## Overriding Slots

### Custom preview

<div v-pre>

```html
<ViewSfc v-bind="$attrs">
	<template #preview>
		<div class="custom-preview">
			<component :is="sfcs[0]?.sfc" />
		</div>
	</template>
</ViewSfc>
```

</div>

### Custom title and description

<div v-pre>

```html
<template #title="{ title }">
	<h3>{{ title }}</h3>
</template>

<template #description="{ description }">
	<div class="description-box">{{ description }}</div>
</template>
```

</div>

### Custom code view

<div v-pre>

```html
<template #codeView>
	<div class="tabs">
		<button @click="mode = 0">TS</button>
		<button @click="mode = 1">JS</button>
		<component :is="slots[`codeView${sfcs[mode].componentName}`]" />
	</div>
</template>
```

</div>

### All available slots

| Slot               | Props             | Description                                          |
| ------------------ | ----------------- | ---------------------------------------------------- |
| `preview`          | —                 | Preview area for the rendered component              |
| `title`            | `{ title }`       | Component title                                      |
| `description`      | `{ description }` | Component description                                |
| `codeView`         | —                 | Syntax highlighted code view                         |
| `codeView{Suffix}` | —                 | Per-file code view, e.g. `codeViewVue`, `codeViewTs` |

### Code rendering priority

When deciding what to render in the code area, the component follows this order:

1. **Slot `codeView<Suffix>`** — per-component slot (only when `codeViewUseSlot: true`)
2. **Slot `codeView`** — generic code view slot
3. **`v-html="htmlCode"`** — build-time highlighted HTML (when `clientHighlight: false`)
4. **`<pre><code>`** — raw source code fallback (plain text)

## Full customization example

<div v-pre>

```html
<!-- .vitepress/theme/preview.vue -->
<template>
	<ViewSfc ref="vsfc" v-bind="$attrs" @codeActive="handleCodeActive">
		<template #preview>
			<div class="preview-box">
				<component :is="currentPreview" />
			</div>
		</template>
		<template #title="{ title }">
			<span class="title-prefix">* {{ title }}</span>
		</template>
		<template #codeView>
			<div class="tab-head">
				<button
					v-for="(_, idx) in sfcs"
					:key="idx"
					:class="{ active: mode === idx }"
					@click="mode = idx"
				>
					{{ sfcs[idx].suffixName }}
				</button>
			</div>
			<component :is="currentCodeView" />
		</template>
	</ViewSfc>
</template>

<script setup lang="ts">
	import ViewSfc, {
		ViewSfcConfigFn,
		ViewSfcTagSymbol
	} from "@vitepress-preview-sfc/components";
	import { computed, ref, provide } from "vue";
	import MyToast from "./MyToast.vue";
	import MyTooltip from "./MyTooltip.vue";

	const config = ViewSfcConfigFn();
	config.toast.value = MyToast;
	config.tooltip.value = MyTooltip;
	provide(ViewSfcTagSymbol, config);

	const vsfc = ref(null);
	const mode = ref(0);
	const sfcs = computed(() => vsfc.value?.sfcs ?? []);
	const currentPreview = computed(() => sfcs.value[mode.value]?.sfc);
	const currentCodeView = computed(
		() =>
			vsfc.value?.slots?.[
				`codeView${sfcs.value[mode.value]?.componentName}`
			]
	);

	function handleCodeActive(index) {
		mode.value = index;
	}
</script>
```

</div>
