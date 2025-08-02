<script setup lang="ts">
  import { codeToHtml } from 'shiki';
  import { onMounted, reactive } from 'vue';
  import ViewSFC from './components/ViewSFC.vue'
  const rct = reactive({
    title: "按钮",
    description: "这是一个按钮示例",
    src: "button.vue",
    code: `%3Ctemplate%3E%0D%0A%20%20%20%20%3Cbutton%20class%3D%22btn%22%3E%0D%0A%20%20%20%20%20%20%20%20%E6%8C%89%E9%92%AE%0D%0A%20%20%20%20%3C%2Fbutton%3E%0D%0A%3C%2Ftemplate%3E%0D%0A%3Cscript%20setup%20lang%3D%22ts%22%3E%0D%0A%0D%0A%3C%2Fscript%3E%0D%0A%3Cstyle%20scope%20lang%3D%22scss%22%3E%0D%0A%20%20%20%20.btn%20%7B%0D%0A%20%20%20%20%20%20%20%20outline%3A%20none%3B%0D%0A%20%20%20%20%7D%0D%0A%3C%2Fstyle%3E%0D%0A`,
    htmlCode: ""
  })
  onMounted(() => {
    codeToHtml(decodeURIComponent(rct.code), {
      lang: 'vue',
      theme: 'vitesse-light'
    }
    ).then(c => {
      rct.htmlCode = c
    })
  })
</script>

<template>
  <ViewSFC :title="rct.title" :code="rct.code" :description="rct.description" :html-code="rct.htmlCode"
    :src="rct.src" />
</template>

<style scoped></style>
