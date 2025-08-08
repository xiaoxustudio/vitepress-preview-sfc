<template>
	<ViewSfc ref="vsfc" v-bind="$attrs">
		<template v-for="(slot, name) in slots" #[name]>
			<component :is="slot" />
		</template>
		<template #title="{ title }">
			<span>*{{ title }}</span>
		</template>
		<template #description="{ description }">
			<span>*{{ description }}</span>
		</template>
	</ViewSfc>
</template>
<script setup lang="ts">
	import ViewSfc, {
		ViewSfcConfig,
		ViewSfcTagSymbol
	} from "@vitepress-preview-sfc/components";
	import "@vitepress-preview-sfc/components/dist/view-sfc.css";
	import toastComponent from "./toast.vue";
	// @ts-ignore
	import { useSlots, useAttrs, ref, onMounted, inject } from "vue";
	const slots = useSlots();
	const vsfc = ref(null);
	const attr = useAttrs();
	const config = inject(ViewSfcTagSymbol, ViewSfcConfig);

	const lang = ref("zh");

	onMounted(() => {
		config.toast.value = toastComponent;
		vsfc.value.btnGroup.unshift({
			key: "change",
			title: "change-lang",
			onClick() {
				lang.value = lang.value === "en" ? "zh" : "en";
				config.collapseText.value =
					lang.value === "en" ? "Collapse" : "收起";
				config.copyTextSuccess.value =
					lang.value === "en" ? "Copy Success" : "复制成功";
				config.copyTextError.value =
					lang.value === "en" ? "Copy Error" : "复制失败";
			}
		});
		vsfc.value.btnGroup.unshift({
			key: "toast",
			title: "other",
			onClick: () => {
				alert(
					JSON.stringify({
						...Object.keys(attr).reduce(
							(p, c) =>
								c.startsWith("markdown")
									? (p[c] = attr[c]) && p
									: p,
							{}
						),
						file: attr["file"]
					})
				);
			}
		});
	});
</script>
<style scope lang="scss"></style>
