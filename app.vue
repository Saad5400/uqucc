<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: 'dark',
    style: 'scrollbar-gutter: stable;',
    dir: 'rtl',
    lang: 'ar',
  },
  title: 'دليل طالب كلية الحاسبات',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ]
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
