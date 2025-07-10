<script setup lang="ts">

definePageMeta({
  layout: 'docs',
});

const route = useRoute();
const { data: page } = await useAsyncData(`pageData:${route.path}`, () => {
  return queryCollection('docs').path(route.path).first();
});

useHead({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description, },
  ],
});
</script>

<template>
  <ContentRenderer v-if="page" :value="page" class="typography" />
</template>
