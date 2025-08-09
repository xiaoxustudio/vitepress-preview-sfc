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

插件将在相对于配置文件的 ../components/button.vue 位置查找文件。

### 基于对象的解析

对于更复杂的项目，您可以使用对象来定义多个路径别名：

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
