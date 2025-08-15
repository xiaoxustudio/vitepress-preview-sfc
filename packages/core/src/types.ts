import { DefineComponent } from "vue";

export interface IConfig {
	alias: string | string[];
	resolveAlias?: string | Record<string, string>;
	codeViewUseSlot?: boolean;
}

export interface SFCMeta {
	absoluteSrc: string;
	code: string;
	componentName: string;
	htmlCode: string;
	sfc?: DefineComponent;
	sfcSlot?: DefineComponent;
	src: string;
	suffixName: string;
}

export interface SFCPrototype {
	code: string;
	description: string;
	extension: string;
	file: string;
	htmlCode: string;
	markdownFile: string;
	markdownTitle: string;
	sfcs: SFCMeta[];
	src: string;
	title: string;
	CompName?: string;
	refName?: string;
}
