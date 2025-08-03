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
	import ViewSfc from "@vitepress-preview-sfc/components";
	import "@vitepress-preview-sfc/components/dist/view-sfc.css";
	// @ts-ignore
	import { useSlots, useAttrs, ref, onMounted } from "vue";
	const slots = useSlots();
	const vsfc = ref(null);
	const attr = useAttrs();
	onMounted(() => {
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
