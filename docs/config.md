# Configuration

The configuration of VitePress Preview SFC is defined by the `IConfig` interface (for the markdown-it plugin) and `ViewSfcConfig` (for the Vue component).

## Plugin options (core)

```ts
export interface IConfig {
	alias: string | string[];
	resolveAlias?: string | Record<string, string>;
	codeViewUseSlot?: boolean;
}
```

| Option            | Type                               | Description                                       |
| ----------------- | ---------------------------------- | ------------------------------------------------- |
| `alias`           | `string \| string[]`               | Custom component tag names (default: `"ViewSfc"`) |
| `resolveAlias`    | `string \| Record<string, string>` | Path resolution aliases for component sources     |
| `codeViewUseSlot` | `boolean`                          | Render code view via slot instead of `v-html`     |

<ViewSfc src="./components/button.ts.vue" title="Example" description="rendered with default alias"></ViewSfc>

### Sub-pages

- [alias](./config/alias) — custom component tag names
- [resolveAlias](./config/resolveAlias) — path resolution
- [codeViewUseSlot](./config/codeViewUseSlot) — slot-based code rendering

## Component options (ViewSfc props)

| Prop          | Type           | Default | Description                                                 |
| ------------- | -------------- | ------- | ----------------------------------------------------------- |
| `title`       | `string`       | `""`    | Component title                                             |
| `description` | `string`       | `""`    | Component description (HTML)                                |
| `src`         | `string`       | `""`    | Source file path                                            |
| `code`        | `string`       | `""`    | Raw source code                                             |
| `htmlCode`    | `string`       | `""`    | Highlighted HTML code                                       |
| `extension`   | `string`       | `""`    | File extension badge                                        |
| `lazy`        | `boolean`      | `true`  | Enable IntersectionObserver lazy loading (default: enabled) |
| `buttonGroup` | `ViewSfcBtn[]` | `[]`    | Custom action buttons                                       |

### Sub-pages

- [i18n / Locale](./config/i18n) — built-in internationalization
- [lazy](./config/lazy) — lazy loading for performance
