export interface LocaleMessages {
	collapseText: string;
	copyTextSuccess: string;
	copyTextError: string;
	showCodeText: string;
	copyCodeText: string;
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
	showCodeText: "显示代码",
	copyCodeText: "复制代码",
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
	showCodeText: "Show Code",
	copyCodeText: "Copy Code",
	accessibility: {
		btnGroupLabel: "Code preview controls",
		codeRegionLabel: "Source code viewer",
		collapseBtnLabel: "Collapse code"
	}
};

const zhTW: LocaleMessages = {
	collapseText: "收起",
	copyTextSuccess: "複製成功",
	copyTextError: "複製失敗",
	showCodeText: "顯示程式碼",
	copyCodeText: "複製程式碼",
	accessibility: {
		btnGroupLabel: "程式碼預覽控制區",
		codeRegionLabel: "原始碼檢視器",
		collapseBtnLabel: "收起程式碼"
	}
};

export const defaultLocales: LocaleDef = { zh, zhTW, en };

export function detectLocale(): string {
	if (typeof document === "undefined") return "en";
	const lang = document.documentElement.lang || navigator.language || "en";
	if (lang.startsWith("zh-TW") || lang.startsWith("zh-HK")) return "zhTW";
	const short = lang.slice(0, 2).toLowerCase();
	return short === "zh" ? "zh" : "en";
}
