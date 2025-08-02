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
                <slot name="description" :description="props.description" />
            </div>
            <div :class="$style.description" v-else>{{ props.description }}</div>

            <div :class="$style['btn-group']">
                <button v-for="v in btnGroup" :key="v.key"
                    :class="[$style.viewBtn, { [$style.active]: isCodeActive && v.key === 'code' }]" @click="v.onClick">
                    <span v-if="typeof v.title === 'string'">{{ v.title }}</span>
                    <component :is="v.title" v-else />
                </button>
            </div>
            <div v-html="showSourceCode"
                :class="[`language-${props.extension}`, $style.code, { [$style.closed]: !isCodeActive }]"
                :style="{ gridTemplateRows: isCodeActive ? '1fr' : '0fr' }">
            </div>
            <div ref="closeDom" :class="$style.closeBtn" v-if="isCodeActive" @click="onCollapse">收起</div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import CodeSvg from '@/assets/code.vue';
    import CopySvg from '@/assets/copy.vue';
    import { computed, h, onBeforeMount, ref, toRef, type VNode } from 'vue';
    import toast from './toast';

    export interface ViewSfcBtn {
        key: string
        title: VNode | string
        onClick: () => void
    }

    export interface ViewSfcProps {
        title: string
        description: string
        src: string
        code: string
        htmlCode: string
        buttonGroup: ViewSfcBtn[]
        extension: string // 后缀
    }

    const props = withDefaults(defineProps<ViewSfcProps>(), {
        title: 'Title',
        description: 'Description',
        src: '',
        code: '',
        htmlCode: '',
        extension: '',
        buttonGroup: () => [
        ]
    });

    const btnGroup = toRef<ViewSfcBtn[]>(props.buttonGroup)
    const closeDom = ref(null)

    const showSourceCode = computed(() => {
        return decodeURIComponent(props.htmlCode)
    })

    const isCodeActive = ref(false)

    defineExpose({ btnGroup })


    const onCollapse = () => {
        isCodeActive.value = !isCodeActive.value
    }

    const onCopy = () => {
        try {
            navigator.clipboard.writeText(decodeURIComponent(props.code)).then(() => {
                toast.success('操作成功完成');
            }).catch(() => {
                toast.error('操作失败');
            })
        } catch {
            toast.error('操作失败');
        }
    }

    onBeforeMount(() => {
        btnGroup.value.push(...[
            {
                key: 'code',
                title: h(CodeSvg),
                onClick: onCollapse
            }, {
                key: 'copy',
                title: h(CopySvg),
                onClick: onCopy
            }])
    })
</script>
<style>
    :root {
        --view-sfc-duration-time: 0.15s;
        --view-sfc-bg: #fff;
        --view-sfc-code-active: rgba(0, 0, 0, 0.3);
        --view-sfc-border: 1px solid rgba(5, 5, 5, 0.06);
        --view-sfc-preview-bottom-border: 1px solid rgba(5, 5, 5, 0.06);
    }

    html.dark {
        --view-sfc-bg: #1e1e1e;
        --view-sfc-code-active: rgba(255, 255, 255, 0.3);
        --view-sfc-border: 1px solid rgba(255, 255, 255, 0.06);
        --view-sfc-preview-bottom-border: 1px solid rgba(255, 255, 255, 0.15);
    }
</style>
<style src="../styles/ViewSFC.scss" lang="scss" module></style>
