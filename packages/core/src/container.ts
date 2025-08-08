import MarkdownIt, { StateBlock, Token } from "markdown-it";

export default function registerContainer(
	md: MarkdownIt,
	name: string = "ViewSfc"
) {
	const min_markers = 3;

	function container(
		state: StateBlock,
		startLine: number,
		endLine: number,
		silent: boolean
	) {
		let start = state.bMarks[startLine] + state.tShift[startLine];
		let max = state.eMarks[startLine];
		let line = state.src.slice(start, max);

		// 查找 ":::" 标记
		const markerMatch = line.match(/:{3,}/);
		if (!markerMatch) return false;

		const maxCount = markerMatch[0].length;
		if (maxCount < min_markers) return false;

		// 获取标记前的内容
		const beforeMarker = line.slice(0, markerMatch.index!).trim();

		// 获取标记后的内容
		const afterMarker = line.slice(markerMatch.index! + maxCount).trim();
		if (!afterMarker.startsWith(name)) return false;

		// 如果标记前有内容，检查是否是单独的一行
		if (beforeMarker.length > 0) {
			if (startLine > 0) {
				const prevLineStart =
					state.bMarks[startLine - 1] + state.tShift[startLine - 1];
				const prevLineMax = state.eMarks[startLine - 1];
				const prevLine = state.src
					.slice(prevLineStart, prevLineMax)
					.trim();
				if (prevLine.length > 0) return false;
			}
		}

		if (silent) return true;

		// 查找容器结束位置
		let nextLine = startLine;

		for (;;) {
			nextLine++;
			if (nextLine >= endLine) break;

			start = state.bMarks[nextLine] + state.tShift[nextLine];
			max = state.eMarks[nextLine];
			line = state.src.slice(start, max);

			if (start < max && state.sCount[nextLine] < state.blkIndent) break;

			// 查找结束标记
			const endMatch = line.match(/:{3,}/);
			if (!endMatch) continue;

			// 确保结束标记至少和开始标记一样长
			if (endMatch[0].length < maxCount) continue;

			// 检查标记前的内容
			const beforeEnd = line.slice(0, endMatch.index!).trim();
			if (beforeEnd.length > 0) continue;

			// 检查标记后的内容
			const afterEnd = line
				.slice(endMatch.index! + endMatch[0].length)
				.trim();
			if (afterEnd.length > 0) continue;

			break;
		}

		const contentStartPos = state.bMarks[startLine + 1];
		const contentEndPos = state.bMarks[nextLine];

		const contentLines = state.src
			.slice(contentStartPos, contentEndPos)
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		// 处理容器组件
		const attrs: Record<string, string>[] =
			transformAttributes(contentLines);
		const attrText = attrs
			.map((attr) =>
				Object.entries(attr)
					.map(([k, v]) => `${k}="${v}"`)
					.join(" ")
			)
			.join(" ");

		const container = `<${name} ${attrText}></${name}>`;

		state.tokens.push({
			type: "html_inline",
			tag: "",
			attrs: null,
			map: [startLine, nextLine],
			nesting: 0,
			level: 0,
			children: null,
			content: container,
			markup: "",
			info: "",
			meta: null,
			block: true,
			hidden: false
		} as Token);

		// 更新源代码
		const lineStart = state.bMarks[startLine];
		const lineEnd = state.bMarks[nextLine] + state.tShift[nextLine];
		const beforeContainer = state.src.slice(0, lineStart);
		const afterContainer = state.src.slice(lineEnd + min_markers);
		state.src = beforeContainer + afterContainer;
	}
	// 确保它能在 alt 代码块规则之前运行
	md.block.ruler.before("fence", "container_sfc_" + name, container, {
		alt: ["paragraph", "reference", "blockquote", "list"]
	});
}

function transformAttributes(str: string[]) {
	const arrs = [];
	for (let i = 0; i < str.length; i++) {
		const line = str[i].trim();
		// 处理k=v
		if (/([^\s]+)\s*=([^\n]+)/.test(line)) {
			const e = /([^\s]+)\s*=([^\n]+)/.exec(line) as RegExpExecArray;
			arrs.push({ [e[1]]: e[2].trim() });
		}
	}
	return arrs;
}
