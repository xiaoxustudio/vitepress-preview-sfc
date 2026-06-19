<template>
	<div :class="$style['view-sfc']">
		<div :class="$style.preview">
			<slot name="preview" />
		</div>
		<div :class="$style.content">
			<div :class="$style.title" v-if="slots.title">
				<slot name="title" :title="props.title" />
			</div>
			<div :class="$style.title" v-else>{{ props.title }}</div>

			<div :class="$style.description" v-if="slots.description">
				<slot name="description" :description="props.description" />
			</div>
			<div
				:class="$style.description"
				v-else
				v-html="props.description"
			></div>

			<div
				:class="$style['btn-group']"
				role="toolbar"
				:aria-label="config.accessibility.btnGroupLabel"
			>
				<component
					:is="config.tooltip.value"
					v-for="v in btnGroup"
					:key="v.key"
					:content="v.tip"
				>
					<button
						:class="[
							$style.viewBtn,
							{
								[$style.active]:
									isCodeActive && v.key === 'code'
							}
						]"
						:aria-label="v.tip"
						:aria-pressed="
							v.key === 'code' ? isCodeActive : undefined
						"
						:aria-controls="
							v.key === 'code' ? codeSectionId : undefined
						"
						@click="v.onClick"
					>
						<span v-if="typeof v.title === 'string'">{{
							v.title
						}}</span>
						<component :is="v.title" v-else />
					</button>
				</component>
			</div>

			<div
				ref="codeSectionRef"
				:id="codeSectionId"
				role="region"
				:aria-label="config.accessibility.codeRegionLabel"
				:class="[$style.code, { [$style.open]: isCodeActive }]"
			>
				<component :is="VNodeForShowSourceCode" />
				<button
					:class="$style.closeBtn"
					@click="onCollapse"
					:aria-label="config.accessibility.collapseBtnLabel"
				>
					{{ config.collapseText }}
				</button>
				<div
					:class="$style['code-extension']"
					:data-ext="props.extension"
				></div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
	import {
		computed,
		h,
		ref,
		unref,
		isRef,
		isReactive,
		toRaw,
		nextTick,
		type VNode
	} from "vue";
	import CodeSvg from "@/assets/code.vue";
	import CopySvg from "@/assets/copy.vue";
	import toast from "./toast";
	import { inject } from "vue";
	import type {
		ViewSfcBtn,
		ViewSfcEmits,
		ViewSfcProps,
		ViewSfcSlots
	} from "@/types";
	import { ViewSfcConfig, ViewSfcTagSymbol } from "@/config";

	const slots = defineSlots<ViewSfcSlots>();
	const props = withDefaults(defineProps<ViewSfcProps>(), {
		title: "",
		description: "",
		src: "",
		code: "",
		htmlCode: "",
		extension: "",
		buttonGroup: () => []
	});

	const config = inject(ViewSfcTagSymbol, ViewSfcConfig);

	const componentId = `vsfc-${Math.random().toString(36).slice(2, 9)}`;
	const codeSectionId = `${componentId}-code`;
	const codeSectionRef = ref<HTMLElement | null>(null);

	const showSourceCode = computed(() => props.htmlCode);

	const VNodeForShowSourceCode = computed<VNode>(() => {
		const staticProps = {
			class: `language-${props.extension}`,
			["data-ext"]: props.extension
		};
		return slots[`codeView${props.sfcs?.[0]?.componentName}`]
			? h(
					"div",
					staticProps,
					slots[`codeView${props.sfcs?.[0]?.componentName}`]()
				)
			: slots["codeView"]
				? h("div", staticProps, slots["codeView"]())
				: h("div", {
						...staticProps,
						innerHTML: showSourceCode.value
					});
	});

	const isCodeActive = ref(false);

	const onCollapse = () => {
		const el = codeSectionRef.value;
		if (!el) return;

		if (isCodeActive.value) {
			const height = el.scrollHeight;
			el.style.maxHeight = `${height}px`;
			el.offsetHeight;
			el.style.maxHeight = "0px";
			isCodeActive.value = false;
			emits("codeActive", false);
		} else {
			el.style.maxHeight = "none";
			nextTick(() => {
				const height = el.scrollHeight;
				el.style.maxHeight = "0px";
				el.offsetHeight;
				el.style.maxHeight = `${height}px`;
				isCodeActive.value = true;
				emits("codeActive", true);
			});
		}
	};

	function deepUnwrap(obj: any) {
		if (isRef(obj)) return deepUnwrap(unref(obj));
		if (isReactive(obj)) return deepUnwrap(toRaw(obj));
		return obj;
	}

	const onCopy = () => {
		try {
			navigator.clipboard
				.writeText(props.code)
				.then(() => {
					toast.success(
						deepUnwrap(config.toast),
						deepUnwrap(config.copyTextSuccess)
					);
				})
				.catch(() => {
					toast.error(
						deepUnwrap(config.toast),
						deepUnwrap(config.copyTextError.value)
					);
				});
		} catch {
			toast.error(
				deepUnwrap(config.toast),
				deepUnwrap(config.copyTextError.value)
			);
		}
	};

	const defaultButtons = [
		{
			key: "code",
			title: h(CodeSvg),
			tip: "Show Code",
			onClick: onCollapse
		},
		{ key: "copy", tip: "Copy Code", title: h(CopySvg), onClick: onCopy }
	];

	const btnGroup = computed<ViewSfcBtn[]>(() => [
		...props.buttonGroup,
		...defaultButtons
	]);

	const emits = defineEmits<ViewSfcEmits>();
	defineExpose({ btnGroup, onCopy, onCollapse });
</script>
<style>
	:root {
		--view-sfc-duration-time: 0.22s;
		--view-sfc-bg: #fff;
		--view-sfc-code-active: rgba(0, 0, 0, 0.3);
		--view-sfc-border: 1px solid rgba(5, 5, 5, 0.1);
		--view-sfc-preview-bottom-border: 1px solid rgba(5, 5, 5, 0.06);
		--view-sfc-btn-hover: #f0f0f0;
		--view-sfc-btn-close-hover: #acacac;
		--view-sfc-scrollbar-thumb: #eeeef3;
		--view-sfc-scrollbar-thumb-hover: #eaeaef;
		--view-sfc-ext-offset-x: 0;
		--view-sfc-ext-offset-y: 0;
	}

	html.dark {
		--view-sfc-bg: #1e1e1e;
		--view-sfc-code-active: rgba(255, 255, 255, 0.3);
		--view-sfc-border: 1px solid rgba(255, 255, 255, 0.06);
		--view-sfc-preview-bottom-border: 1px solid rgba(255, 255, 255, 0.15);
		--view-sfc-btn-hover: #404040;
		--view-sfc-btn-close-hover: #acacac;
		--view-sfc-scrollbar-thumb: #2d2d2d;
		--view-sfc-scrollbar-thumb-hover: #3e3e3e;
	}
</style>
<style src="../styles/ViewSFC.scss" lang="scss" module></style>
