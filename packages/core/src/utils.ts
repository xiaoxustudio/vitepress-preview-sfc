import { readFileSync, statSync } from "fs";
import path from "path";
import type {
	IConfig,
	SFCPrototype,
	SFCMeta,
	MarkdownIt,
	Token
} from "./types";

/* 
	部分逻辑思路来自于 https://github.com/flingyp/vitepress-demo-preview
	感谢 @flingyp 大佬
*/

const checksArrMap = new Map<string, RegExp[]>();
export const escapeHtml = (s: string) =>
	s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/{/g, "&#123;")
		.replace(/}/g, "&#125;");
const readFileCache = new Map<string, { content: string; mtime: number }>();
const highlightCache = new Map<string, { content: string; mtime: number }>();

function getFileContent(absPath: string): string {
	const cached = readFileCache.get(absPath);
	if (cached !== undefined) {
		const stat = statSync(absPath);
		if (stat.mtimeMs === cached.mtime) return cached.content;
	}
	const content = readFileSync(absPath, "utf-8");
	const stat = statSync(absPath);
	readFileCache.set(absPath, { content, mtime: stat.mtimeMs });
	return content;
}

function getHighlightedCode(
	md: MarkdownIt,
	code: string,
	suffix: string,
	absPath: string
): string {
	const cacheKey = `${absPath}:${suffix}`;
	const cached = highlightCache.get(cacheKey);
	if (cached !== undefined) {
		const stat = statSync(absPath);
		if (stat.mtimeMs === cached.mtime) return cached.content;
	}
	const result = md.options.highlight!(code, suffix, "");
	const stat = statSync(absPath);
	highlightCache.set(cacheKey, { content: result, mtime: stat.mtimeMs });
	return result;
}

export const checksArr = (config: IConfig) => {
	const regexs = [];
	for (const alias of config.alias) {
		if (checksArrMap.has(alias))
			regexs.push(...(checksArrMap.get(alias) ?? []));
		else {
			const regexGroup = [
				new RegExp(`^<(${alias}) (.*)></${alias}>$`),
				new RegExp(`^<(${alias}) (.*)/>$`)
			];
			regexs.push(...regexGroup);
			checksArrMap.set(alias, [...regexGroup]);
		}
	}
	return regexs;
};
export const scriptSetup = /<\s*script\b[^>]*\bsetup\b[^>]*>/i;
export const matchAttr = /(\w+)\s*=\s*["']([^"']+)["']/g;

export const getAttr = () => /(\w+)\s*=\s*["']([^"']+)["']/;

export function hasVueRefImport(importStr: string) {
	const regex = /import\s+\{[^}]*?\bref\b[^}]*?\}\s+from\s+['"]vue['"]/;
	return regex.test(importStr);
}

/**
 * @description: code to htmlCode
 * @return {*}
 */
export const transformHTMLCode = (
	mdInstance: MarkdownIt,
	sourceCode: string,
	suffix: string
) => mdInstance.options.highlight!(sourceCode, suffix, "");

/**
 * @description: to Hump Naming
 * @param {string} componentName
 * @return {*}
 */
export const toName = (componentName: string) => {
	return componentName.replace(/[_|-]+(\w)/g, (_, $1) => $1.toUpperCase());
};

/**
 * 根据组件路径组合组件引用名称
 * @param path
 * @returns
 */
export const composeComponentName = (path: string) => {
	const parts = path.split("/");
	const cleanedParts = parts
		.filter((part) => part && part !== "." && part !== "..")
		.map((part) => part.replace(/[\\/:*?"<>|.'\s]/g, ""));

	return cleanedParts.join("-").split(".")[0];
};

export const getCompoentName = (src: string, suffixName: string = "Sfc") => {
	const pathName = composeComponentName(src);
	const name = toName(pathName);
	let componentName = `${name}${suffixName}`;
	if (/^[0-9]/.test(componentName)) componentName = `_${componentName}`;
	return componentName;
};

export const getComponentRefName = (sfcs: any) => {
	return (
		sfcs.map((v: { componentName: any }) => v.componentName).join("_") +
		"Ref"
	);
};

// 解析多路径写法：按花括号分组展开，支持 {a,b}/{c,d}.vue 等多组
export function transformSrc(srcString: string): string[] {
	if (!srcString) return [];
	const parts = srcString.split(/{([^}]+)}/);
	if (parts.length === 1) return [srcString];
	const choices = parts.map((part, i) =>
		i % 2 === 0 ? [part] : part.split(",").map((s) => s.trim())
	);
	return choices.reduce((acc, cur) =>
		acc.flatMap((a) => cur.map((b) => a + b))
	);
}

function toTransformAttributes(
	md: MarkdownIt,
	env: any,
	config: any,
	originText: string
): SFCPrototype {
	// 当前可匹配组件名称
	const matched = checksArr(config).filter((v) => v.test(originText));
	if (!matched.length) {
		throw `not find the ViewSfc(or resolveAlias) Component`;
	}
	const attr = matched[0].exec(originText);
	if (!attr) {
		throw `not find the ViewSfc(or resolveAlias) Component`;
	}
	const toAttrFilter = attr[2].match(matchAttr);
	if (!toAttrFilter) {
		throw `not find the ViewSfc(or resolveAlias) Component`;
	}
	let toProperties = toAttrFilter
		.map((v: string) => {
			const m = getAttr().exec(v);
			return m ? { [m[1]]: m[2] } : null;
		})
		.reduce((acc: any, cur: any) => {
			if (cur) {
				Object.assign(acc, cur);
			}
			return acc;
		}, {}) as SFCPrototype;
	toProperties.CompName = attr![1];
	toProperties.sfcs = [];
	if (toProperties?.src) {
		const srcArr = transformSrc(toProperties.src);
		for (let index = 0; index < srcArr.length; index++) {
			const element = srcArr[index];
			const sfcMeta: SFCMeta = {
				absoluteSrc: path.resolve(path.dirname(env.path), element),
				code: "",
				htmlCode: "",
				componentName: "",
				suffixName: "",
				src: element
			};
			if (config.resolveAlias) {
				if (typeof config.resolveAlias === "string") {
					sfcMeta.absoluteSrc = config.resolveAlias
						? path.resolve(config.resolveAlias, element)
						: path.resolve(path.dirname(env.path), element);
				} else {
					for (const alias in config.resolveAlias) {
						const aliasPath = config.resolveAlias[alias];
						if (element.startsWith(alias)) {
							sfcMeta.absoluteSrc = path.resolve(
								aliasPath,
								element.replace(alias, "")
							);
							sfcMeta.src = path
								.normalize(sfcMeta.absoluteSrc)
								.replace(
									path.normalize(path.dirname(env.path)),
									"."
								)
								.replace(/\\/g, "/");
							break;
						}
					}
				}
			}
			try {
				sfcMeta.code = getFileContent(sfcMeta.absoluteSrc);
			} catch (e) {
				throw new Error(
					`[vitepress-preview-sfc] Failed to read SFC file: ${sfcMeta.absoluteSrc}. ${e instanceof Error ? e.message : ""}`
				);
			}
			sfcMeta.suffixName = sfcMeta.src.substring(
				sfcMeta.src.lastIndexOf(".") + 1
			);
			if (!config.clientHighlight) {
				sfcMeta.htmlCode =
					getHighlightedCode(
						md,
						sfcMeta.code,
						sfcMeta.suffixName,
						sfcMeta.absoluteSrc
					) ?? "";
			}
			sfcMeta.componentName = getCompoentName(sfcMeta.src);
			// add script to import component
			injectComponentImportScript(sfcMeta, env);
			toProperties.sfcs.push(sfcMeta);
		}
	}
	toProperties.refName = getComponentRefName(toProperties.sfcs);
	injectComponentSfcsRef(toProperties.sfcs, env);
	return toProperties;
}

/**
 * @description: transform viewSFC input attrs (processed)
 * @return {*}
 */
export function transformPreview(
	md: MarkdownIt,
	env: any,
	token: Token,
	config: IConfig
): string {
	// console.time("transformPreview");
	const originText = token.content;

	const attributes = toTransformAttributes(md, env, config, originText);

	const firstMeta = attributes.sfcs[0];
	const isNotEmpty = attributes.sfcs.length;

	// 生成设置sfc h 模板代码
	const GenerateSfcCode = () => {
		const sfcs = attributes.sfcs;
		let text = "";
		for (const val of sfcs) {
			text += `v.componentName==='${val.componentName}'?${val.componentName}:`;
		}
		return `({...v,sfc:${text.slice(0, text.length - 1)}:undefined})`;
	};

	const GenerateSfcSlotCode = () => {
		const sfcs = attributes.sfcs;
		let text = "";
		for (const val of sfcs) {
			if (config.clientHighlight) {
				text += `<template #codeView${val.componentName}><pre><code class="language-${val.suffixName}">${escapeHtml(val.code)}</code></pre></template>`;
			} else {
				text += `<template #codeView${val.componentName}>${val.htmlCode}</template>`;
			}
		}
		return text;
	};

	const description = attributes.description || "";
	const encodedDescription = encodeURIComponent(md.renderInline(description));

	// 因为有可能有多个组件，所以需要将第一个组件的属性作为默认值
	const firstMetaSrc = firstMeta?.src || "";
	const firstMetaCode = isNotEmpty ? encodeURIComponent(firstMeta.code) : "";
	const firstMetaSuffixName = firstMeta?.suffixName || "";
	const firstMetaComponentName = firstMeta?.componentName || "";
	const fileName = firstMetaSrc ? path.basename(firstMetaSrc) : "";
	const firstMetaHtmlCode = isNotEmpty
		? encodeURIComponent(firstMeta.htmlCode)
		: "";

	const previewTemplate =
		isNotEmpty && firstMetaSrc
			? `<template #preview><component :is="${firstMetaComponentName}" /></template>`
			: "";

	const codeViewTemplate =
		isNotEmpty && firstMetaSrc
			? config.codeViewUseSlot
				? GenerateSfcSlotCode()
				: config.clientHighlight
					? `<template #codeView><pre><code class="language-${firstMetaSuffixName}">${escapeHtml(firstMeta.code)}</code></pre></template>`
					: `<template #codeView>${firstMeta.htmlCode}</template>`
			: "";

	const sfcsAttribute = isNotEmpty
		? `JSON.parse(decodeURIComponent(${attributes.refName})).map(v=>${GenerateSfcCode()})`
		: "[]";

	// console.timeEnd("transformPreview");
	return `<${attributes.CompName} 
	src="${firstMetaSrc}" 
	title="${attributes.title || ""}" 
	:description="decodeURIComponent(\`${encodedDescription}\`)" 
	:code="decodeURIComponent(\`${firstMetaCode}\`)" 
	:htmlCode="decodeURIComponent(\`${firstMetaHtmlCode}\`)" 
	extension="${firstMetaSuffixName}" 
	file="${fileName}" 
	:sfcs="${sfcsAttribute}"
	markdownFile="${env.relativePath}" 
	markdownTitle="${env.title}"
	>
	${previewTemplate}
	${codeViewTemplate}
	</${attributes.CompName}>`;
}

function injectComponentSfcsRef(sfcs: SFCMeta[], env: any) {
	const scriptsCode = env.sfcBlocks.scripts as any[];
	const content = env.content;
	const isScript =
		scriptSetup.test(content) ||
		scriptsCode.some((v) => scriptSetup.test(v.tagOpen));
	const refName = getComponentRefName(sfcs);

	const sfcsEncode = encodeURIComponent(JSON.stringify(sfcs));

	if (isScript) {
		let { content } = scriptsCode[0];
		if (content.includes(refName)) return;
		const scriptCodeBlock = '<script lang="ts" setup>\n';
		// 判断是否引入ref
		if (!hasVueRefImport(content)) {
			content = content.replace(
				scriptSetup,
				`${scriptCodeBlock}import { ref } from 'vue'`
			);
		} else {
			content = content.replace(scriptSetup, scriptCodeBlock);
		}
		content = content.replace(
			"</script>",
			`const ${refName}=ref(\`${sfcsEncode}\`);\n</script>`
		);
		scriptsCode[0].content = content;
	} else {
		scriptsCode.push({
			type: "script",
			tagClose: "</script>",
			tagOpen: "<script setup lang='ts'>",
			content: `<script setup lang='ts'>
			import { ref } from 'vue'
			const ${refName}=ref(\`${sfcsEncode}\`);
        </script>`,
			contentStripped: "import { ref } from 'vue'"
		});
	}
}

function injectComponentImportScript(toProperties: any, env: any) {
	const src = toProperties.src;
	const componentName = toProperties.componentName;
	const content = env.content;
	const scriptsCode = env.sfcBlocks.scripts as any[];
	const isScript =
		scriptSetup.test(content) ||
		scriptsCode.some((v) => scriptSetup.test(v.tagOpen));

	const importScript = `import ${componentName} from ${JSON.stringify(src)};`;
	if (isScript) {
		let { content } = scriptsCode[0];
		// 已引入组件（检查 componentName 的 import 声明，兼容别名路径）
		if (
			new RegExp(`import\\s+${componentName}\\s+from\\s+['"]`).test(
				content
			)
		)
			return;
		const scriptCodeBlock = '<script lang="ts" setup>\n';
		content = content.replace(scriptSetup, scriptCodeBlock); // 统一替换
		content = content.replace("</script>", `${importScript}\n</script>`);
		scriptsCode[0].content = content;
	} else {
		scriptsCode.push({
			type: "script",
			tagClose: "</script>",
			tagOpen: "<script setup lang='ts'>",
			content: `<script setup lang='ts'>
        ${importScript}
        </script>`,
			contentStripped: `import ${componentName} from '${src}';`
		});
	}
}
