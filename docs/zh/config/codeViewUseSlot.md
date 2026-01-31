# codeViewUseSlot

用于控制代码视图是否使用插槽。

## 使用方法

```js
md.use(previewSfcCore, {
	codeViewUseSlot: true
});
```

激活后，代码视图将使用插槽来渲染代码区域，而不是直接渲染 HTML 代码（通过 `v-html`）。
