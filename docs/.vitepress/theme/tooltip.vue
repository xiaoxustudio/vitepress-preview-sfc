<template>
	<TooltipComponent v-bind="$attrs">
		<slot />
		<template #content="{ content }"> msg: {{ content }} </template>
	</TooltipComponent>
</template>
<script setup lang="ts">
	import { TooltipComponent } from "@vitepress-preview-sfc/components";
</script>
<style scoped lang="scss"></style>
