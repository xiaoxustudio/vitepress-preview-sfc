# resolveAlias

`resolveAlias` 选项是一个强大的功能，使您能够更高效地管理组件路径。它的功能类似于 Vite 或 Webpack 等工具中的路径别名，允许您在 Markdown 文件中使用更短、更易读的路径。

### 基于字符串的解析

路径解析的最简单形式是使用字符串作为基础目录：

```ts
md.use(previewSfcCore, {
	resolveAlias: path.resolve(__dirname, "../components")
});
```

使用此配置，当您引用以下组件时：

```md
<ViewSfc src="button.vue"></ViewSfc>
```

插件将在相对于配置文件的 `../components/button.vue` 位置查找文件。

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

这使您能够为不同的目录使用不同的前缀：

```md
<ViewSfc src="@/button.vue"></ViewSfc>
<ViewSfc src="@@/preview.vue"></ViewSfc>
```
