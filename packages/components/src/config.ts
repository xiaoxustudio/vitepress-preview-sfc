import { shallowRef, ref } from "vue";
import ToastComponent from "@/components/Toast.vue";
import TooltipComponent from "./components/Tooltip.vue";

export const ViewSfcConfigFn = () => {
	return {
		collapseText: ref("收起"),
		copyTextSuccess: ref("复制成功"),
		copyTextError: ref("复制失败"),
		toast: shallowRef(ToastComponent),
		tooltip: shallowRef(TooltipComponent)
	};
};

export const ViewSfcConfig = ViewSfcConfigFn();

export const ViewSfcTagSymbol = Symbol("ViewSfcTag");
