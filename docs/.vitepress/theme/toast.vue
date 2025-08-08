<template>
	<ToastComponent :v-bind="$attrs">
		<template #message="{ message }"> msg: {{ message }} </template>
	</ToastComponent>
</template>
<script setup lang="ts">
	import { ToastComponent } from "@vitepress-preview-sfc/components";
</script>
<style scoped lang="scss"></style>
