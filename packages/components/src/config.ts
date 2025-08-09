import { ref } from "vue";
import ToastComponent from "@/components/Toast.vue";
import TooltipComponent from "./components/Tooltip.vue";

export const ViewSfcConfig = {
	collapseText: ref("收起"),
	copyTextSuccess: ref("复制成功"),
	copyTextError: ref("复制失败"),
	toast: ref(ToastComponent),
	tooltip: ref(TooltipComponent)
};

export const ViewSfcTagSymbol = Symbol("ViewSfcTag");
