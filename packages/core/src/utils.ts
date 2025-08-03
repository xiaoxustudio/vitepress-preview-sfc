import { readFileSync } from "fs";
import MarkdownIt, { Token } from "markdown-it";
import path from "path";
import { IConfig } from "./types";

/* 
	部分逻辑思路来自于 https://github.com/flingyp/vitepress-demo-preview
	感谢 @flingyp 大佬
*/
export const checksArr = (config: IConfig) => {
	const aliasArr = [];
	if (Array.isArray(config.alias)) {
		aliasArr.push(...config.alias);
	} else {
		aliasArr.push(config.alias);
	}
	const regexs = [];
	for (const alias of aliasArr) {
		regexs.push(
			new RegExp(`^<(${alias}) (.*)></${alias}>$`),
			new RegExp(`^<(${alias}) (.*) />$`)
		);
	}
	return regexs;
};
export const scriptSetup =
	/<\s*script\s+(setup|lang='ts'|lang="ts")?\s*(setup|lang='ts'|lang="ts")?\s*>/;
export const matchAttr = /(\w+)\s*=\s*["']([^"']+)["']/g;

export const getAttr = () => /(\w+)\s*=\s*["']([^"']+)["']/;

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
	return componentName.replace(/[_|-]+(\w)/g, ($0, $1) => {
		return $1.toUpperCase();
	});
};

/**
 * 根据组件路径组合组件引用名称
 * @param path
 * @returns
 */
export const composeComponentName = (path: string) => {
	let isFlag = true;
	let componentList: string[] = [];
	while (isFlag) {
		const lastIndex = path.lastIndexOf("/");
		if (lastIndex === -1) {
			isFlag = false;
		} else {
			const name = path.substring(lastIndex + 1);

			componentList.unshift(name);
			path = path.substring(0, lastIndex);
		}
	}
	componentList = componentList.filter(
		(item) => item !== "" && item !== "." && item !== ".."
	);
	return componentList.join("-").split(".")[0];
};

export const getCompoentName = (src: string, suffixName: string = "Sfc") => {
	const pathName = composeComponentName(src);
	const name = toName(pathName);
	const componentName = `${name}${suffixName}`;
	return componentName;
};

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
	const originText = token.content;
	// 获取当前md文件路径
	const basePath = path.basename(env.path);

	// 当前可匹配组件名称

	const attr = checksArr(config)
		.filter((v) => v.test(originText))[0]
		.exec(originText);
	const CompName = attr[1];
	const toAttrFilter = attr[2].match(matchAttr);
	if (!toAttrFilter) return originText;
	const toProperties = toAttrFilter
		.map((v) =>
			getAttr().test(v)
				? {
						[getAttr().exec(v)![1]]: getAttr().exec(v)![2]
					}
				: null
		)
		.reduce((acc, cur) => {
			if (cur) {
				Object.assign(acc, cur);
			}
			return acc;
		}, {});
	const componentName = getCompoentName(toProperties.src);
	toProperties.absoluteSrc = path.resolve(
		path.dirname(env.path),
		toProperties.src
	);
	toProperties.code = readFileSync(toProperties.absoluteSrc, "utf-8");
	const suffixName = toProperties.src.substring(
		toProperties.src.lastIndexOf(".") + 1
	);
	// add script to import component
	injectComponentImportScript(toProperties, env);

	return `<${CompName} 
	src="${toProperties.src}" 
	title="${toProperties.title || basePath}" 
	description="${toProperties.description}" 
	code="${encodeURIComponent(toProperties.code)}" 
	htmlCode="${encodeURIComponent(
		transformHTMLCode(md, toProperties.code, suffixName || "plain")
	)}" 
	extension="${suffixName}" 
	><template #preview><${componentName} /></template></${CompName}>`;
}

function injectComponentImportScript(toProperties: any, env: any) {
	const src = toProperties.src;
	const componentName = getCompoentName(src);
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
			contentStripped: `import ${componentName} from '${src}'`
		});
	}
}
