import { readFileSync } from "fs";
import MarkdownIt, { Token } from "markdown-it";
import path from "path";
import { IConfig, SFCMeta, SFCPrototype } from "./types";

/* 
	部分逻辑思路来自于 https://github.com/flingyp/vitepress-demo-preview
	感谢 @flingyp 大佬
*/

const checksArrMap = new Map<string, RegExp[]>();

export const checksArr = (config: IConfig) => {
	const regexs = [];
	for (const alias of config.alias) {
		if (checksArrMap.has(alias)) regexs.push(...checksArrMap.get(alias));
		else {
			const regexGroup = [
				new RegExp(`^<(${alias}) (.*)></${alias}>$`),
				new RegExp(`^<(${alias}) (.*)/>$`)
			];
			regexs.push(...regexGroup);
			checksArrMap.set(alias, regexs);
		}
	}
	return regexs;
};
export const scriptSetup =
	/<\s*script\s+(setup|lang='ts'|lang="ts")?\s*(setup|lang='ts'|lang="ts")?\s*>/;
export const matchAttr = /(\w+)\s*=\s*["']([^"']+)["']/g;

export const getAttr = () => /(\w+)\s*=\s*["']([^"']+)["']/;

export function hasVueRefImport(importStr) {
	// 匹配import关键字，后面跟{ ... }结构，其中包含ref，并且从'vue'或"vue"导入
	const regex =
		/import\s+\{\s*[^}]*?(?:^|,|\s)ref(?:$|,|\s)[^}]*?\s*\}\s+from\s+['"]vue['"]/;
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
	const componentName = `${name}${suffixName}`;
	return componentName;
};

export const getComponentRefName = (sfcs: any) => {
	return sfcs.map((v) => v.componentName).join("_") + "Ref";
};

// 解析多路径写法
function transformSrc(srcString: string) {
	if (!srcString) return "";
	const reg = /{(.+)}/;
	if (!reg.test(srcString)) return srcString;
	const matchText = reg.exec(srcString);
	const srcArr = matchText[1].split(",").map((v) => {
		const val = v.trim();
		return (
			srcString.slice(0, matchText.index) +
			val +
			srcString.slice(matchText.index + matchText[0].length)
		);
	});
	return srcArr;
}

function toTransformAttributes(
	md: MarkdownIt,
	env: any,
	config: any,
	originText: string
): SFCPrototype {
	// 当前可匹配组件名称
	const attr = checksArr(config)
		.filter((v) => v.test(originText))[0]
		.exec(originText);
	const toAttrFilter = attr[2].match(matchAttr);
	if (!toAttrFilter) {
		throw `not find the ViewSfc(or resolveAlias) Component`;
	}
	const toProperties = toAttrFilter
		.map((v: string) =>
			getAttr().test(v)
				? {
						[getAttr().exec(v)![1]]: getAttr().exec(v)![2]
					}
				: null
		)
		.reduce((acc: any, cur: any) => {
			if (cur) {
				Object.assign(acc, cur);
			}
			return acc;
		}, {}) as SFCPrototype;
	toProperties.CompName = attr[1];
	toProperties.sfcs = [];
	if (toProperties?.src) {
		// 解析是否存在多模块语法
		let srcArr = transformSrc(toProperties.src);
		if (!Array.isArray(srcArr)) {
			srcArr = [srcArr];
		}
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
			sfcMeta.code = readFileSync(sfcMeta.absoluteSrc, "utf-8");
			sfcMeta.suffixName = sfcMeta.src.substring(
				sfcMeta.src.lastIndexOf(".") + 1
			);
			sfcMeta.htmlCode = transformHTMLCode(
				md,
				sfcMeta.code,
				sfcMeta.suffixName
			);
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
			text += `<template #codeView${val.componentName}>${val.htmlCode}</template>`;
		}
		return text;
	};

	const description = attributes.description || "";
	const encodedDescription = encodeURIComponent(md.renderInline(description));
	const firstMetaSrc = firstMeta?.src || "";
	const firstMetaCode = isNotEmpty ? encodeURIComponent(firstMeta.code) : "";
	const firstMetaHtmlCode = isNotEmpty
		? encodeURIComponent(firstMeta.htmlCode)
		: "";
	const firstMetaSuffixName = firstMeta?.suffixName || "";
	const firstMetaComponentName = firstMeta?.componentName || "";
	const fileName = firstMetaSrc ? path.basename(firstMetaSrc) : "";

	const previewTemplate =
		isNotEmpty && firstMetaSrc
			? `<template #preview><component :is="${firstMetaComponentName}" /></template>`
			: "";

	const codeViewTemplate =
		isNotEmpty && firstMetaSrc
			? config.codeViewUseSlot
				? GenerateSfcSlotCode()
				: `<template #codeView>${firstMetaHtmlCode}</template>`
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

	const importScript = `import ${componentName} from '${src}';`;
	if (isScript) {
		let { content } = scriptsCode[0];
		// 已引入组件
		if (content.includes(src) || content.includes(componentName)) return;
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
