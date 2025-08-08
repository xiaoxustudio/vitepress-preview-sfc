import { ref } from "vue";
import ToastComponent from "@/components/Toast.vue";

export const ViewSfcConfig = {
	collapseText: ref("收起"),
	copyTextSuccess: ref("复制成功"),
	copyTextError: ref("复制失败"),
	toast: ref(ToastComponent)
};

export const ViewSfcTagSymbol = Symbol("ViewSfcTag");
