# API Reference

## Plugin Options (IConfig)

Pass these options when calling `md.use(previewSfcCore, options)` in your VitePress config.

```ts
interface IConfig {
	alias?: string | string[];
	resolveAlias?: string | Record<string, string>;
	codeViewUseSlot?: boolean;
	clientHighlight?: boolean;
}
```

| Option            | Type                               | Default     | Description                                                                                                                                                        |
| ----------------- | ---------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `alias`           | `string \| string[]`               | `"ViewSfc"` | Custom component tag names. `"ViewSfc"` is always included regardless of this value.                                                                               |
| `resolveAlias`    | `string \| Record<string, string>` | `env.path`  | Path resolution for `src` attributes. A string sets a base directory; an object maps prefixes to directories (e.g. `{ "@/": "./components" }`).                    |
| `codeViewUseSlot` | `boolean`                          | `false`     | When `true`, the code view is rendered via named slots (`codeView<ComponentName>`) instead of `v-html`. Required for interactive code views (e.g., tab switchers). |
| `clientHighlight` | `boolean`                          | `false`     | When `true`, skips build-time syntax highlighting and sends raw source code to the browser. Speeds up builds for pages with many previews.                         |

See detailed pages: [alias](./config/alias), [resolveAlias](./config/resolveAlias), [codeViewUseSlot](./config/codeViewUseSlot), [clientHighlight](./config/clientHighlight).

---

## Component Props (ViewSfcProps)

These are the props accepted by the `<ViewSfc>` component.

```ts
interface ViewSfcProps {
	title?: string;
	description?: string;
	src?: string;
	code?: string;
	htmlCode?: string;
	extension?: string;
	lazy?: boolean;
	buttonGroup?: ViewSfcBtn[];
	sfcs?: SFCMeta[];
}
```

| Prop          | Type           | Default | Description                                                                 |
| ------------- | -------------- | ------- | --------------------------------------------------------------------------- |
| `title`       | `string`       | `""`    | Component title, rendered above the code area.                              |
| `description` | `string`       | `""`    | Component description, supports HTML via `v-html`.                          |
| `src`         | `string`       | `""`    | Source file path. Supports brace expansion (`{a,b}.vue`).                   |
| `code`        | `string`       | `""`    | Raw source code. Auto-populated by the plugin.                              |
| `htmlCode`    | `string`       | `""`    | Syntax-highlighted HTML. Auto-populated when `clientHighlight: false`.      |
| `extension`   | `string`       | `""`    | File extension badge (e.g., `"vue"`, `"tsx"`).                              |
| `lazy`        | `boolean`      | `true`  | Enable IntersectionObserver-based lazy loading.                             |
| `buttonGroup` | `ViewSfcBtn[]` | `[]`    | Custom action buttons appended to the toolbar.                              |
| `sfcs`        | `SFCMeta[]`    | —       | Array of SFC metadata. Auto-populated by the plugin for multi-file support. |

Props marked "auto-populated" are filled in at build time by the markdown-it plugin. You do not need to set them manually when using the tag in Markdown.

---

## Component Slots

Slots let you customize the rendering of each section.

| Slot                      | Scope                     | Description                                                                                                               |
| ------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `preview`                 | —                         | Replace the entire preview area. Use to render dynamic components or custom layouts.                                      |
| `title`                   | `{ title: string }`       | Custom title rendering.                                                                                                   |
| `description`             | `{ description: string }` | Custom description rendering.                                                                                             |
| `codeView`                | —                         | Custom code view output. Replaces the default highlighted HTML or raw code.                                               |
| `codeView[ComponentName]` | —                         | Per-component code view slot. Only available when `codeViewUseSlot: true`. Named dynamically as `codeViewMyComponentSfc`. |

### Code rendering priority

When deciding what to render in the code area, the component follows this order:

1. **Slot `codeView<ComponentName>`** — per-component slot (only when `codeViewUseSlot: true`)
2. **Slot `codeView`** — generic code view slot
3. **`v-html="htmlCode"`** — build-time highlighted HTML (when `clientHighlight: false`)
4. **`<pre><code>`** — raw source code fallback (plain text)

---

## Component Emits

```ts
interface ViewSfcEmits {
	(e: "codeActive", state: boolean): void;
}
```

| Event        | Payload   | Description                                                                  |
| ------------ | --------- | ---------------------------------------------------------------------------- |
| `codeActive` | `boolean` | Emitted when the code section is toggled. `true` = opened, `false` = closed. |

---

## Component Expose

Access these via a template ref:

```html
<ViewSfc ref="vsfc" />
```

```ts
const vsfc = ref<InstanceType<typeof ViewSfc> | null>(null);
```

| Exposed         | Type                        | Description                                                                                                   |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `btnGroup`      | `ComputedRef<ViewSfcBtn[]>` | The full computed button array (custom + default code/copy buttons).                                          |
| `onCopy`        | `() => void`                | Programmatically trigger the copy action.                                                                     |
| `onCollapse`    | `() => void`                | Programmatically toggle the code section.                                                                     |
| `customButtons` | `Ref<ViewSfcBtn[]>`         | Array you can push custom buttons into at runtime. Buttons are inserted before the default code/copy buttons. |

---

## Types

### ViewSfcBtn

```ts
interface ViewSfcBtn {
	key: string;
	title: VNode | string;
	tip?: string;
	onClick: () => void;
}
```

| Field     | Type              | Description                                                             |
| --------- | ----------------- | ----------------------------------------------------------------------- |
| `key`     | `string`          | Unique button identifier.                                               |
| `title`   | `VNode \| string` | Button label. Can be a string or a Vue VNode (e.g., an icon component). |
| `tip`     | `string`          | Tooltip text shown on hover.                                            |
| `onClick` | `() => void`      | Click handler.                                                          |

### SFCMeta

```ts
interface SFCMeta {
	absoluteSrc: string;
	code: string;
	componentName: string;
	htmlCode: string;
	sfc?: DefineComponent;
	sfcSlot?: DefineComponent;
	src: string;
	suffixName: string;
}
```

### SFCPrototype

```ts
interface SFCPrototype {
	code: string;
	description: string;
	extension: string;
	file: string;
	markdownFile: string;
	markdownTitle: string;
	sfcs: SFCMeta[];
	src: string;
	title: string;
	CompName?: string;
	refName?: string;
}
```

### LocaleMessages

```ts
interface LocaleMessages {
	collapseText: string;
	copyTextSuccess: string;
	copyTextError: string;
	showCodeText: string;
	copyCodeText: string;
	accessibility: {
		btnGroupLabel: string;
		codeRegionLabel: string;
		collapseBtnLabel: string;
	};
}
```

---

## Package Exports

### From `@vitepress-preview-sfc/components`

```ts
import ViewSfc from "@vitepress-preview-sfc/components";
```

| Export             | Type                  | Description                                                                               |
| ------------------ | --------------------- | ----------------------------------------------------------------------------------------- |
| `default`          | `Component`           | The main `ViewSfc` preview component.                                                     |
| `ViewSfcConfigFn`  | `() => ViewSfcConfig` | Factory function to create a fresh config instance (avoids polluting the global default). |
| `ViewSfcConfig`    | `ViewSfcConfig`       | Default global config instance. Used when no config is provided via `provide`.            |
| `ViewSfcTagSymbol` | `Symbol`              | Injection key for providing a custom config to child ViewSfc components.                  |
| `ToastComponent`   | `Component`           | The default toast notification component. Can be replaced with a custom one.              |
| `TooltipComponent` | `Component`           | The default tooltip component. Can be replaced with a custom one.                         |
| `defaultLocales`   | `LocaleDef`           | Built-in locale messages (`en`, `zh`, `zhTW`).                                            |
| `detectLocale`     | `() => string`        | Auto-detect locale from `<html lang>` or `navigator.language`.                            |

### From `@vitepress-preview-sfc/core`

```ts
import previewSfcCore from "@vitepress-preview-sfc/core";
```

| Export         | Type                                                   | Description                            |
| -------------- | ------------------------------------------------------ | -------------------------------------- |
| `default`      | `(md: MarkdownIt, options?: Partial<IConfig>) => void` | The markdown-it plugin function.       |
| `SFCMeta`      | `type`                                                 | SFC metadata interface.                |
| `SFCPrototype` | `type`                                                 | Parsed component attributes interface. |
| `IConfig`      | `type`                                                 | Plugin options interface.              |
