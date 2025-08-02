import MarkdownIt, { Renderer, Token } from "markdown-it";
import { checksArr, transformPreview } from "./utils";
import { IConfig } from "./types";

const defaultConfig: IConfig = {
	alias: "ViewSfc",
};

export default function xuranPlugin(md: MarkdownIt, options?: any) {
	const defaultHtmlInlineRender = md.renderer.rules.html_inline!;
	md.renderer.rules.html_inline = (
		tokens: Token[],
		idx: number,
		mdOptions: MarkdownIt.Options,
		env: any,
		self: Renderer
	) => {
		const config = { ...defaultConfig, ...options };
		if (Array.isArray(config.alias)) {
			config.alias = [...new Set(config.alias.concat(defaultConfig.alias))];
		} else {
			config.alias = [...new Set([config.alias, defaultConfig.alias])];
		}
		const token = tokens[idx];
		if (checksArr(config).some(v => v.test(token.content))) {
			return transformPreview(md, env, token, config);
		}
		return defaultHtmlInlineRender(tokens, idx, mdOptions, env, self);
	};
}
