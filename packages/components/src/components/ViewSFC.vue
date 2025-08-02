<template>
    <div :class="$style['view-sfc']">
        <div :class="$style.preview">
            <slot name="preview" />
        </div>
        <div :class="$style.content">
            <div :class="$style.title" v-if="$slots.title">
                <slot name="title" :title="title" />
            </div>
            <div :class="$style.title" v-else>{{ title }}</div>
            <div :class="$style.description" v-if="$slots.description">
                <slot name="description" />
            </div>
            <div :class="$style.description" v-else>{{ description }}</div>
            <div :class="$style['btn-group']">
                <button :class="[$style.viewBtn, { [$style.active]: isCodeActive }]" @click="onClick">
                    <CodeSvg />
                </button>
                <button :class="[$style.viewBtn]" @click="onCopy">
                    <CopySvg />
                </button>
            </div>
            <div v-html="showSourceCode" :class="['language-vue', $style.code, { [$style.closed]: !isCodeActive }]"
                :style="{ gridTemplateRows: isCodeActive ? '1fr' : '0fr' }">
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import CodeSvg from '@/assets/code.vue';
    import CopySvg from '@/assets/copy.vue';
    import { computed, ref } from 'vue';
    import toast from './toast';

    interface PreviewProps {
        title: string
        description: string
        src: string
        code: string
        htmlCode: string
    }

    const props = withDefaults(defineProps<PreviewProps>(), {
        title: '默认标题',
        description: '描述内容',
        src: '',
        code: '',
        htmlCode: '',
    });

    const showSourceCode = computed(() => {
        return decodeURIComponent(props.htmlCode)
    })

    const isCodeActive = ref(false)

    const onClick = () => {
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


</script>
<style>
    :root {
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
