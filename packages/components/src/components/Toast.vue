<template>
	<transition name="toast-fade">
		<div
			v-if="visible"
			class="toast"
			:class="toastClass"
			@mouseenter="pauseTimer"
			@mouseleave="resumeTimer"
			@click="handleClick"
		>
			<div class="toast-content">
				<slot v-if="$slots.message" name="message" :message></slot>
				<span v-else>{{ message }}</span>
			</div>
			<div v-if="closable" class="toast-close" @click.stop="close">
				&times;
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
	import { defineComponent, computed, ref, type PropType } from "vue";
	import type { ToastType, ToastPosition } from "@/types";

	export default defineComponent({
		name: "Toast",
		props: {
			message: {
				type: String,
				default: ""
			},
			type: {
				type: String as PropType<ToastType>,
				default: "info"
			},
			position: {
				type: String as PropType<ToastPosition>,
				default: "top-right"
			},
			duration: {
				type: Number,
				default: 3000
			},
			closable: {
				type: Boolean,
				default: true
			},
			onClick: {
				type: Function as PropType<() => void>,
				default: null
			}
		},
		setup(props, { emit }) {
			const visible = ref(true);
			const timer = ref<ReturnType<typeof setTimeout> | null>(null);
			const remainingTime = ref(props.duration);
			const paused = ref(false);

			const toastClass = computed(() => [
				`toast-${props.type}`,
				`toast-${props.position}`
			]);

			const startTimer = () => {
				if (props.duration <= 0) return;

				timer.value = setTimeout(() => {
					close();
				}, remainingTime.value);
			};

			const pauseTimer = () => {
				if (timer.value) {
					clearTimeout(timer.value);
					remainingTime.value -= props.duration - remainingTime.value;
					paused.value = true;
				}
			};

			const resumeTimer = () => {
				if (paused.value && remainingTime.value > 0) {
					startTimer();
					paused.value = false;
				}
			};

			const close = () => {
				visible.value = false;
				if (timer.value) {
					clearTimeout(timer.value);
				}
				emit("close");
			};

			const handleClick = () => {
				if (props.onClick) {
					props.onClick();
				}
			};

			// 初始化计时器
			startTimer();

			return {
				visible,
				toastClass,
				pauseTimer,
				resumeTimer,
				close,
				handleClick
			};
		}
	});
</script>

<style src="../styles/Toast.scss" lang="scss" scoped></style>
