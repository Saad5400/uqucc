<script setup lang="ts">
import { findPageBreadcrumb, findPageChildren } from '@nuxt/content/utils';

definePageMeta({
  layout: 'docs',
});

const route = useRoute();

const { data: page } = await useAsyncData(`pageData:${route.path}`, () => {
  return queryCollection('docs').path(route.path).first();
});
const { data: items } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('docs')
);
const children = findPageChildren(items.value ?? undefined, route.path);
const breadcrumbs = findPageBreadcrumb(items.value ?? undefined, route.path, { current: true });

useHead({
  title: page.value?.title,
  meta: [
    { name: 'description', content: page.value?.description, },
  ],
});

defineOgImageComponent('Seo', {
  title: page.value?.title,
  description: page.value?.description,
});
</script>

<template>
  <Breadcrumb class="mt-4 mb-6">
    <BreadcrumbList>
      <div class="contents" v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        <BreadcrumbItem>
          <BreadcrumbLink as-child v-if="index !== breadcrumbs.length - 1">
            <NuxtLink :to="breadcrumb.path">
              {{ breadcrumb.title }}
            </NuxtLink>
          </BreadcrumbLink>
          <BreadcrumbPage v-else>
            {{ breadcrumb.title }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
      </div>
    </BreadcrumbList>
  </Breadcrumb>
  <ContentRenderer v-if="page" :value="page" class="typography" />
  <div v-if="!page && children" class="typography">
    <h1>
      {{ breadcrumbs.at(-1)?.title }}
    </h1>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,80dvw),1fr))] gap-4">
      <PageCard v-for="child in children" :key="child.path" :title="child.title" :href="child.path" />
    </div>
  </div>
</template>
