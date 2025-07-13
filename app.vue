<script setup lang="ts">
useHead({
  htmlAttrs: {
    dir: 'rtl',
    lang: 'ar',
  },
  title: 'دليل طالب كلية الحاسبات',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' },
  ]
});
</script>

<template>
  <NuxtLayout name="docs">
    <NuxtPage />
  </NuxtLayout>
</template>
