<template>
	<ViewSfc
		class="vsfcComponent"
		ref="vsfc"
		v-bind="$attrs"
		@codeActive="handleCodeActive"
	>
		<template #preview>
			<component :is="currentVnodePreview" />
		</template>
		<template #title="{ title }">
			<span>*{{ title }}</span>
		</template>
		<template #description="{ description }">
			<span>*{{ description }}</span>
		</template>
		<template #codeView>
			<div class="container">
				<div class="tabHead">
					<button
						class="tabBtn"
						:class="{
							active: mode === 0
						}"
						@click="changeMode(0)"
					>
						TS
					</button>
					<button
						class="tabBtn"
						:class="{
							active: mode === 1
						}"
						@click="changeMode(1)"
					>
						JS
					</button>
				</div>
				<div class="tabContent">
					<component :is="currentCodeView" />
				</div>
			</div>
		</template>
	</ViewSfc>
</template>
<script setup lang="ts">
	import ViewSfc, {
		ViewSfcConfigFn,
		ViewSfcTagSymbol
	} from "@vitepress-preview-sfc/components";
	import { SFCMeta, SFCPrototype } from "@vitepress-preview-sfc/core";
	import toastComponent from "./toast.vue";
	import tooltipComponent from "./tooltip.vue";
	import {
		useAttrs,
		ref,
		computed,
		onMounted,
		provide,
		useSlots,
		h
	} from "vue";
	const vsfc = ref<any>(null);
	const attr = useAttrs() as unknown as SFCPrototype;
	const slots = useSlots();

	//  using a function to prevent contamination of the original object
	const defaultViewSfcConfig = ViewSfcConfigFn();

	provide(ViewSfcTagSymbol, defaultViewSfcConfig);

	const lang = ref("zh"); // lang
	const mode = ref(0); // mode

	const sfcs = attr.sfcs as SFCMeta[];

	const currentCodeView = computed(() =>
		slots[`codeView${sfcs[mode.value].componentName}`]
			? h(
					"div",
					{},
					slots[`codeView${sfcs[mode.value].componentName}`]?.()
				)
			: h("div", {
					innerHTML: sfcs[mode.value].htmlCode
				})
	);

	const currentVnodePreview = computed(() => sfcs[mode.value]?.sfc);

	const changeMode = (v: number) => {
		mode.value = v;
	};

	const handleCodeActive = (state: boolean) =>
		console.log("state changed:", state);

	onMounted(() => {
		defaultViewSfcConfig.toast.value = toastComponent;
		defaultViewSfcConfig.tooltip.value = tooltipComponent;

		vsfc.value?.btnGroup.unshift({
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
	.vsfcComponent {
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
		padding: 2px 5px;
		letter-spacing: 0.05em;
		box-sizing: border-box;
		box-shadow: 0 0 10px rgb(240, 240, 240, 0.15);
		text-align: center;

		&:hover {
			border: 1px solidrgb(76, 86, 97) y;
		}

		&.active {
			border-bottom: 1px solid slategray;
		}
	}

	.tabContent div[class*="language-"] {
		margin-top: 0;
	}

	.container:has(.tabContent > div > pre.twoslash) .tabHead {
		background-color: white;
	}
</style>
