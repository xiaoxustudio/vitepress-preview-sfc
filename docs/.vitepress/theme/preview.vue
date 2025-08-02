<template>
    <ViewSfc v-bind="$attrs">
        <template v-for="(slot, name) in slots" #[name]>
            <component :is="slot" />
        </template>
        <template #title="{ title }">
            <span>*{{ title }}</span>
        </template>
    </ViewSfc>
</template>
<script setup lang="ts">
    import ViewSfc from "@vitepress-preview-sfc/components";
    import "@vitepress-preview-sfc/components/dist/view-sfc.css";
    // @ts-ignore
    import { useSlots } from "vue"
    const slots = useSlots()
</script>
<style scope lang="scss"></style>
