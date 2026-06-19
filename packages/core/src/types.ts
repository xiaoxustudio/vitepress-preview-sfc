import type { DefineComponent } from "vue";

export interface IConfig {
	alias: string | string[];
	resolveAlias?: string | Record<string, string>;
	codeViewUseSlot?: boolean;
	clientHighlight?: boolean;
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
	markdownFile: string;
	markdownTitle: string;
	sfcs: SFCMeta[];
	src: string;
	title: string;
	CompName?: string;
	refName?: string;
}

import type MarkdownIt from "markdown-it";
import type { Options } from "markdown-it";
import type Renderer from "markdown-it/lib/renderer.mjs";
import type Token from "markdown-it/lib/token.mjs";
import type StateBlock from "markdown-it/lib/rules_block/state_block.mjs";
export type { MarkdownIt, Token, Options, Renderer, StateBlock };
