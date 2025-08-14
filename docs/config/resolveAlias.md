# resolveAlias

The `resolveAlias` option is a powerful feature that enables you to manage component paths more efficiently. It functions similarly to path aliases found in tools like Vite or Webpack, allowing you to use shorter and more readable paths in Markdown files.

### String-based parsing

The simplest form of path resolution uses strings as the base directory:

```ts
md.use(previewSfcCore, {
	resolveAlias: path.resolve(__dirname, "../components")
});
```

Using this configuration, when you reference the following components:

```md
<ViewSfc src="button.vue"></ViewSfc>
```

The plugin will look for the file at the location of `../components/button.vue` relative to the configuration file.

### Object-based parsing

For more complex projects, you can use objects to define multiple path aliases:

```ts
md.use(previewSfcCore, {
	resolveAlias: {
		"@/": path.resolve(__dirname, "../components"),
		"@@/": path.resolve(__dirname, "./theme")
	}
});
```

This enables you to use different prefixes for different directories:

```md
<ViewSfc src="@/button.vue"></ViewSfc>
<ViewSfc src="@@/preview.vue"></ViewSfc>
```
