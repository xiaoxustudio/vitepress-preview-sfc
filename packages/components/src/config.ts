import { ref } from "vue";

export const ViewSfcConfig = {
	collapseText: ref("收起"),
	copyTextSuccess: ref("复制成功"),
	copyTextError: ref("复制失败")
};

export const ViewSfcTagSymbol = Symbol("ViewSfcTag");
