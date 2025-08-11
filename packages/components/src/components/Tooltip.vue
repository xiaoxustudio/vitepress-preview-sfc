<template>
	<div class="tooltip-container" ref="triggerRef">
		<div
			v-if="$props.content"
			@mouseenter="showTooltip"
			@mouseleave="() => hideTooltip(true)"
		>
			<slot></slot>
			<Teleport to="body">
				<transition name="tooltip-fade">
					<div
						v-if="isVisible"
						class="tooltip"
						:class="`tooltip-${placement}`"
						:style="tooltipStyle"
						ref="tooltipRef"
					>
						<div class="tooltip-content">
							<slot
								v-if="$slots.content"
								name="content"
								:content
							></slot>
							<span v-else>{{ content }}</span>
						</div>
					</div>
				</transition>
			</Teleport>
		</div>
		<slot v-else></slot>
	</div>
</template>

<script lang="ts">
	import {
		defineComponent,
		ref,
		computed,
		onMounted,
		onUnmounted,
		nextTick
	} from "vue";

	export default defineComponent({
		name: "Tooltip",
		props: {
			content: {
				type: String,
				default: ""
			},
			placement: {
				type: String,
				default: "top",
				validator: (value: string) =>
					["top", "bottom", "left", "right"].includes(value)
			},
			delay: {
				type: Number,
				default: 150
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		setup(props, { slots }) {
			const triggerRef = ref<HTMLDivElement | null>(null);
			const tooltipRef = ref<HTMLDivElement | null>(null);
			const isVisible = ref(false);
			const tooltipPosition = ref({ top: 0, left: 0 });
			let timeoutId: number;
			let isMouseOverTrigger = false; // 跟踪鼠标是否在触发元素上

			// 计算提示框样式
			const tooltipStyle = computed(() => {
				return {
					top: `${tooltipPosition.value.top}px`,
					left: `${tooltipPosition.value.left}px`
				};
			});

			// 显示提示框
			const showTooltip = () => {
				if (props.disabled || (!props.content && !slots.content))
					return;

				isMouseOverTrigger = true;
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					isVisible.value = true;
					nextTick(updatePosition);
				}, props.delay);
			};

			// 隐藏提示框
			const hideTooltip = (immediate = false) => {
				isMouseOverTrigger = false;
				clearTimeout(timeoutId);

				if (immediate) {
					isVisible.value = false;
				} else {
					timeoutId = setTimeout(() => {
						isVisible.value = false;
					}, props.delay);
				}
			};

			// 更新提示框位置
			const updatePosition = () => {
				if (!triggerRef.value || !tooltipRef.value) return;

				const triggerRect = triggerRef.value.getBoundingClientRect();
				const tooltipRect = tooltipRef.value.getBoundingClientRect();

				let top = 0;
				let left = 0;

				switch (props.placement) {
					case "top":
						top = triggerRect.top - tooltipRect.height - 10;
						left =
							triggerRect.left +
							(triggerRect.width - tooltipRect.width) / 2;
						break;
					case "bottom":
						top = triggerRect.bottom + 10;
						left =
							triggerRect.left +
							(triggerRect.width - tooltipRect.width) / 2;
						break;
					case "left":
						top =
							triggerRect.top +
							(triggerRect.height - tooltipRect.height) / 2;
						left = triggerRect.left - tooltipRect.width - 10;
						break;
					case "right":
						top =
							triggerRect.top +
							(triggerRect.height - tooltipRect.height) / 2;
						left = triggerRect.right + 10;
						break;
				}

				// 确保提示框在视口内
				top = Math.max(
					10,
					Math.min(top, window.innerHeight - tooltipRect.height - 10)
				);
				left = Math.max(
					10,
					Math.min(left, window.innerWidth - tooltipRect.width - 10)
				);

				tooltipPosition.value = { top, left };
			};

			// 处理滚动事件
			const handleScroll = () => {
				if (isVisible.value) {
					// 立即隐藏 Tooltip
					hideTooltip(true);

					// 如果鼠标仍在触发元素上，滚动后重新显示
					if (isMouseOverTrigger) {
						nextTick(() => {
							showTooltip();
						});
					}
				}
			};

			// 监听窗口大小变化
			const handleResize = () => {
				if (isVisible.value) {
					updatePosition();
				}
			};

			onMounted(() => {
				window.addEventListener("resize", handleResize);
				window.addEventListener("scroll", handleScroll, {
					passive: true
				});
			});

			onUnmounted(() => {
				window.removeEventListener("resize", handleResize);
				window.removeEventListener("scroll", handleScroll);
				clearTimeout(timeoutId);
			});

			return {
				triggerRef,
				tooltipRef,
				isVisible,
				tooltipStyle,
				showTooltip,
				hideTooltip
			};
		}
	});
</script>

<style>
	/* 定义CSS变量 */
	:root {
		--sfc-tooltip-bg: white;
		--sfc-tooltip-text: #333;
		--sfc-tooltip-border: #e0e0e0;
		--sfc-tooltip-shadow: rgba(0, 0, 0, 0.05);
	}

	/* 暗色模式变量 */
	.dark {
		--sfc-tooltip-bg: #333;
		--sfc-tooltip-text: #f0f0f0;
		--sfc-tooltip-border: #555;
		--sfc-tooltip-shadow: rgba(0, 0, 0, 0.05);
	}
</style>

<style scoped>
	.tooltip-container {
		display: inline-block;
		position: relative;
	}

	.tooltip {
		position: fixed;
		z-index: 9999;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 14px;
		max-width: 300px;
		box-shadow: 0 4px 12px var(--sfc-tooltip-shadow);
		transition:
			opacity 0.2s,
			transform 0.2s;
		background-color: var(--sfc-tooltip-bg);
		color: var(--sfc-tooltip-text);
		border: 1px solid var(--sfc-tooltip-border);
	}

	.tooltip-content {
		position: relative;
		z-index: 1;
	}

	.tooltip-fade-enter-active,
	.tooltip-fade-leave-active {
		transition:
			opacity 0.2s,
			transform 0.2s;
	}

	.tooltip-fade-enter-from,
	.tooltip-fade-leave-to {
		opacity: 0;
		transform: translateY(5px);
	}
</style>
