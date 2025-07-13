<script setup lang="ts">
import { findPageBreadcrumb, findPageChildren } from '@nuxt/content/utils';
import PageCard from '~/components/PageCard.vue';

const route = useRoute();

const { data: page } = await useAsyncData(`page:${route.path}`, () =>
  queryCollection('docs').path(route.path).first()
);
const { data: items } = await useContentNavigation();
const children = findPageChildren(items.value ?? [], route.path);
const breadcrumbs = findPageBreadcrumb(items.value ?? [], route.path, { current: true });

useSeoMeta({
  ...(page.value?.seo || {}),
  ogTitle: page.value?.title,
  ogDescription: page.value?.description,
  ogUrl: `https://uqucc.sb.sa${route.path}`,
  ogType: 'website',
  ogImageUrl: encodeURI(`https://uqucc.sb.sa/api/screenshot?path=${route.path}`),
  ogImageWidth: 720,
  ogImageHeight: 377,
  ogImageType: 'image/png',
  ogImageAlt: page.value?.title,
  twitterCard: 'summary_large_image',
  twitterTitle: page.value?.title,
  twitterDescription: page.value?.description,
  twitterImage: encodeURI(`https://uqucc.sb.sa/api/screenshot?path=${route.path}`),
  twitterImageWidth: 720,
  twitterImageHeight: 377,
  twitterImageAlt: page.value?.title,
  twitterSite: '@SaadBatwa',
  twitterCreator: '@SaadBatwa',
});
</script>

<template>
  <Breadcrumb class="mb-4" v-if="breadcrumbs.length > 1">
    <BreadcrumbList>
      <div class="contents" v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        <BreadcrumbItem>
          <BreadcrumbLink as-child v-if="index !== breadcrumbs.length - 1">
            <NuxtLink :to="breadcrumb.path">
              {{ breadcrumb.title }}
            </NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 2" />
      </div>
    </BreadcrumbList>
  </Breadcrumb>
  <ContentRenderer v-if="page" :value="page" class="typography" />
  <div v-if="!page && children" class="typography">
    <h1>
      {{ breadcrumbs.at(-1)?.title }}
    </h1>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,80dvw),1fr))] gap-4">
      <PageCard v-for="child in children" :key="child.path" :href="child.path">
        {{ child.title }}
      </PageCard>
    </div>
  </div>
</template>
