<template>
	<ViewSfc class="vsfc" ref="vsfc" v-bind="$attrs">
		<slot name="preview" />
		<template #title="{ title }">
			<span>*{{ title }}</span>
		</template>
		<template #description="{ description }">
			<span>*{{ description }}</span>
		</template>
		<template #codeView="{ codeView }">
			<component :is="codeView" />
		</template>
	</ViewSfc>
</template>
<script setup lang="ts">
	import ViewSfc, {
		ViewSfcConfigFn,
		ViewSfcTagSymbol
	} from "@vitepress-preview-sfc/components";
	import toastComponent from "./toast.vue";
	import tooltipComponent from "./tooltip.vue";
	// @ts-ignore
	import { useAttrs, ref, onMounted, provide } from "vue";
	const vsfc = ref(null);
	const attr = useAttrs();

	//  using a function to prevent contamination of the original object
	const defaultViewSfcConfig = ViewSfcConfigFn();

	provide(ViewSfcTagSymbol, defaultViewSfcConfig);

	const lang = ref("zh");

	onMounted(() => {
		defaultViewSfcConfig.toast.value = toastComponent;
		defaultViewSfcConfig.tooltip.value = tooltipComponent;

		vsfc.value.btnGroup.unshift({
			key: "change",
			title: "change-lang",
			onClick() {
				lang.value = lang.value === "en" ? "zh" : "en";
				defaultViewSfcConfig.collapseText.value =
					lang.value === "en" ? "Collapse" : "收起";
				defaultViewSfcConfig.copyTextSuccess.value =
					lang.value === "en" ? "Copy Success" : "复制成功";
				defaultViewSfcConfig.copyTextError.value =
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
<style scope lang="scss">
	.vsfc {
		border: none;
		border-radius: 4px;
		padding: 10px;
		box-sizing: border-box;
		overflow: hidden;
		transition: all 0.3s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

		&:hover {
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}
	}

	.tabHead {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
	}

	.tabBtn {
		padding: 2px 10px;
		letter-spacing: 0.5em;
		box-sizing: border-box;
		box-shadow: 0 0 10px #f0f0f0;
		border: 1px solid slategray;

		&:hover {
			border: 1px solidrgb(76, 86, 97) y;
		}
	}
</style>
