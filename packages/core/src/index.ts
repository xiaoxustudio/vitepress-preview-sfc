import { checksArr, transformPreview } from "./utils";
import type { IConfig, MarkdownIt, Options, Renderer, Token } from "./types";
import registerContainer from "./container";

const defaultConfig: IConfig = {
	alias: "ViewSfc",
	codeViewUseSlot: false
};

export default function (md: MarkdownIt, options?: any) {
	const defaultHtmlInlineRender = md.renderer.rules.html_inline!;

	const config = { ...defaultConfig, ...options };
	if (Array.isArray(config.alias)) {
		config.alias = [...new Set(config.alias.concat(defaultConfig.alias))];
	} else {
		config.alias = [...new Set([config.alias, defaultConfig.alias])];
	}

	for (const alias of config.alias) {
		registerContainer(md, alias);
	}

	md.renderer.rules.html_inline = (
		tokens: Token[],
		idx: number,
		mdOptions: Options,
		env: any,
		self: Renderer
	) => {
		const token = tokens[idx];
		if (checksArr(config).some((v) => v.test(token.content))) {
			return transformPreview(md, env, token, config);
		}
		return defaultHtmlInlineRender(tokens, idx, mdOptions, env, self);
	};
}
