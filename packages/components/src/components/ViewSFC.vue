<template>
	<div :class="$style['view-sfc']">
		<div :class="$style.preview">
			<slot name="preview" />
		</div>
		<div :class="$style.content">
			<div :class="$style.title" v-if="$slots.title">
				<slot name="title" :title="props.title" />
			</div>
			<div :class="$style.title" v-else>{{ props.title }}</div>

			<div :class="$style.description" v-if="$slots.description">
				<slot
					name="description"
					:description="decodeURIComponent(props.description)"
				/>
			</div>
			<div
				:class="$style.description"
				v-else
				v-html="decodeURIComponent(props.description)"
			></div>

			<div :class="$style['btn-group']">
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
				:class="[$style.code, { [$style.closed]: !isCodeActive }]"
				:style="{ gridTemplateRows: isCodeActive ? '1fr' : '0fr' }"
			>
				<slot
					v-if="$slots.codeView"
					name="codeView"
					:codeView="VNodeForShowSourceCode"
				/>
				<component v-else :is="VNodeForShowSourceCode.value" />
				<div
					ref="closeDom"
					:class="$style.closeBtn"
					v-if="isCodeActive"
					@click="onCollapse"
				>
					{{ config.collapseText }}
				</div>
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
		onMounted,
		ref,
		toRef,
		unref,
		isRef,
		isReactive,
		toRaw,
		shallowRef
	} from "vue";
	import CodeSvg from "@/assets/code.vue";
	import CopySvg from "@/assets/copy.vue";
	import toast from "./toast";
	import { inject } from "vue";
	import type { ViewSfcBtn, ViewSfcProps } from "@/types";
	import { ViewSfcConfig, ViewSfcTagSymbol } from "@/config";

	const props = withDefaults(defineProps<ViewSfcProps>(), {
		title: "",
		description: "",
		src: "",
		code: "",
		htmlCode: "",
		extension: "",
		buttonGroup: () => []
	});

	const btnGroup = toRef<ViewSfcBtn[]>(props.buttonGroup);

	const config = inject(ViewSfcTagSymbol, ViewSfcConfig);

	const closeDom = ref(null); // 关闭按钮

	const showSourceCode = computed(() => decodeURIComponent(props.htmlCode));

	const VNodeForShowSourceCode = computed(() =>
		shallowRef(
			h("div", {
				class: `language-${props.extension}`,
				innerHTML: showSourceCode.value
			})
		)
	);

	const isCodeActive = ref(false); // 是否显示代码

	const onCollapse = () => (isCodeActive.value = !isCodeActive.value);

	function deepUnwrap(obj: any) {
		if (isRef(obj)) return deepUnwrap(unref(obj));
		if (isReactive(obj)) return deepUnwrap(toRaw(obj));
		return obj;
	}

	const onCopy = () => {
		try {
			navigator.clipboard
				.writeText(decodeURIComponent(props.code))
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

	defineExpose({ btnGroup, onCopy, onCollapse });

	onMounted(() => {
		btnGroup.value.push(
			...[
				{
					key: "code",
					title: h(CodeSvg),
					tip: "Show Code",
					onClick: onCollapse
				},
				{
					key: "copy",
					tip: "Copy Code",
					title: h(CopySvg),
					onClick: onCopy
				}
			]
		);
	});
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
