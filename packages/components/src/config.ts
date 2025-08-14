import { shallowRef, ref, type Component } from "vue";
import ToastComponent from "@/components/Toast.vue";
import TooltipComponent from "./components/Tooltip.vue";

export const ViewSfcConfigFn = () => {
	return {
		collapseText: ref("收起"),
		copyTextSuccess: ref("复制成功"),
		copyTextError: ref("复制失败"),
		toast: shallowRef<Component>(ToastComponent),
		tooltip: shallowRef<Component>(TooltipComponent)
	};
};

export const ViewSfcConfig = ViewSfcConfigFn();

export const ViewSfcTagSymbol = Symbol("ViewSfcTag");
