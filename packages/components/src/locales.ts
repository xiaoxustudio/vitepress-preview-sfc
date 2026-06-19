export interface LocaleMessages {
	collapseText: string;
	copyTextSuccess: string;
	copyTextError: string;
	accessibility: {
		btnGroupLabel: string;
		codeRegionLabel: string;
		collapseBtnLabel: string;
	};
}

export type LocaleDef = Record<string, LocaleMessages>;

const zh: LocaleMessages = {
	collapseText: "收起",
	copyTextSuccess: "复制成功",
	copyTextError: "复制失败",
	accessibility: {
		btnGroupLabel: "代码预览控制区",
		codeRegionLabel: "源代码查看器",
		collapseBtnLabel: "收起代码"
	}
};

const en: LocaleMessages = {
	collapseText: "Collapse",
	copyTextSuccess: "Copy Success",
	copyTextError: "Copy Error",
	accessibility: {
		btnGroupLabel: "Code preview controls",
		codeRegionLabel: "Source code viewer",
		collapseBtnLabel: "Collapse code"
	}
};

export const defaultLocales: LocaleDef = { zh, en };

export function detectLocale(): string {
	if (typeof document === "undefined") return "en";
	const lang = document.documentElement.lang || navigator.language || "en";
	const short = lang.slice(0, 2).toLowerCase();
	return short === "zh" ? "zh" : "en";
}
