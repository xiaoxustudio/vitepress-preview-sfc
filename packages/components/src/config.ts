import { shallowRef, ref, reactive, type Component } from "vue";
import ToastComponent from "@/components/Toast.vue";
import TooltipComponent from "./components/Tooltip.vue";
import { defaultLocales, detectLocale, type LocaleMessages } from "./locales";

export const ViewSfcConfigFn = () => {
	const collapseText = ref("");
	const copyTextSuccess = ref("");
	const copyTextError = ref("");
	const showCodeText = ref("");
	const copyCodeText = ref("");
	const accessibility = reactive({
		btnGroupLabel: "",
		codeRegionLabel: "",
		collapseBtnLabel: ""
	});
	const currentLocale = ref(detectLocale());
	const userLocales: Record<string, LocaleMessages> = { ...defaultLocales };

	function applyLocale(locale: string) {
		const msgs = userLocales[locale] || userLocales.en;
		if (!msgs) return;
		collapseText.value = msgs.collapseText;
		copyTextSuccess.value = msgs.copyTextSuccess;
		copyTextError.value = msgs.copyTextError;
		showCodeText.value = msgs.showCodeText;
		copyCodeText.value = msgs.copyCodeText;
		accessibility.btnGroupLabel = msgs.accessibility.btnGroupLabel;
		accessibility.codeRegionLabel = msgs.accessibility.codeRegionLabel;
		accessibility.collapseBtnLabel = msgs.accessibility.collapseBtnLabel;
	}

	applyLocale(currentLocale.value);

	return {
		collapseText,
		copyTextSuccess,
		copyTextError,
		showCodeText,
		copyCodeText,
		toast: shallowRef<Component>(ToastComponent),
		tooltip: shallowRef<Component>(TooltipComponent),
		accessibility,
		locale: currentLocale,
		locales: userLocales,
		setLocale(locale: string) {
			if (userLocales[locale]) {
				currentLocale.value = locale;
				applyLocale(locale);
			}
		}
	};
};

export const ViewSfcConfig = ViewSfcConfigFn();

export const ViewSfcTagSymbol = Symbol("ViewSfcTag");

export type { LocaleMessages };
