# codeViewUseSlot

Used to control whether the code view uses slots.

## Usage

```js
md.use(previewSfcCore, {
	codeViewUseSlot: true
});
```

After being activated, the code view will render the code area using slots instead of directly rendering HTML code (via `v-html`).
