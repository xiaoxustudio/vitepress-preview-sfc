# 自定义

VitePress Preview SFC 提供多种自定义方式：CSS 变量、自定义 Toast/Tooltip 组件、自定义按钮和插槽覆盖。

## CSS 变量

### `--vp-preview-bg`

预览区域的背景颜色。

**默认值：** `#ffffff`

```css
--vp-preview-bg: #f5f5f5;
```

### `--vp-preview-padding`

预览区域的内边距。

**默认值：** `16px`

```css
--vp-preview-padding: 24px;
```

### `--vp-preview-border`

预览区域的边框。

**默认值：** `1px solid #e0e0e0`

```css
--vp-preview-border: 2px dashed #333;
```

### `--vp-code-tabs-bg`

代码标签栏的背景颜色。

```css
--vp-code-tabs-bg: #f0f0f0;
```

### `--vp-code-tabs-active-color`

活跃代码标签指示器的颜色。

```css
--vp-code-tabs-active-color: #42b883;
```

## 自定义 Toast 组件

你可以用自定义组件替换默认的 Toast 通知。自定义组件接收以下属性：

- `message` — Toast 消息文本
- `type` — `"success"` | `"error"` | `"warning"` | `"info"`
- `position` — `"top-right"` | `"top-left"` | `"bottom-right"` | `"bottom-left"`
- `duration` — 自动关闭时间（毫秒），`<= 0` 禁用自动关闭
- `closable` — 显示关闭按钮
- `onClick` — 点击处理函数

在主题中注册：

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

## 自定义 Tooltip 组件

同样地，替换默认的 tooltip：

```ts
const config = ViewSfcConfigFn();
config.tooltip.value = MyTooltip;
```

Tooltip 组件接收以下属性：

| 属性        | 类型      | 默认值  | 说明                                       |
| ----------- | --------- | ------- | ------------------------------------------ |
| `content`   | `string`  | `""`    | Tooltip 文本                               |
| `placement` | `string`  | `"top"` | `"top"`、`"bottom"`、`"left"` 或 `"right"` |
| `delay`     | `number`  | `150`   | 显示/隐藏延迟（毫秒）                      |
| `disabled`  | `boolean` | `false` | 禁用 tooltip                               |

## 自定义按钮

### 通过 `buttonGroup` 属性添加静态按钮

```md
<ViewSfc src="./button.vue" :buttonGroup="[{ key: 'alert', title: 'Info', onClick: () => alert('hi') }]"></ViewSfc>
```

### 通过 `customButtons` 暴露添加动态按钮

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
				// 切换语言
			}
		});
	});
</script>
```

</div>

## 覆盖插槽

### 自定义预览

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

### 自定义标题和描述

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

### 自定义代码视图

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

### 所有可用插槽

| 插槽             | 作用域            | 说明                                                   |
| ---------------- | ----------------- | ------------------------------------------------------ |
| `preview`        | —                 | 预览区域                                               |
| `title`          | `{ title }`       | 组件标题                                               |
| `description`    | `{ description }` | 组件描述                                               |
| `codeView`       | —                 | 语法高亮的代码视图                                     |
| `codeView{后缀}` | —                 | 每个文件独立的代码视图，如 `codeViewVue`、`codeViewTs` |

### 代码渲染优先级

渲染代码区域时，组件按以下顺序决定：

1. **插槽 `codeView<文件名>`** — 每个组件独立的插槽（仅 `codeViewUseSlot: true` 时）
2. **插槽 `codeView`** — 通用代码视图插槽
3. **`v-html="htmlCode"`** — 构建时高亮 HTML（`clientHighlight: false` 时）
4. **`<pre><code>`** — 原始源代码回退（纯文本）

## 完整自定义示例

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
