<script setup lang="ts">
import { Icon } from "#components";
import { findPageBreadcrumb, findPageChildren } from "@nuxt/content/utils";
import { Pencil } from "lucide-vue-next";
import PageCard from "~/components/PageCard.vue";
import { findPageItem } from "~/lib/utils";

const route = useRoute();

const page = await useCurrentPage();
const { data: items } = await useContentNavigation();

const itemsList = computed(() => {
  return items.value ?? [];
});
const normalizedPath = computed(() => {
  return route.path.replace(/\/$/, ""); // Remove trailing slash for consistency
});

const pageItem = findPageItem(itemsList.value, normalizedPath.value);
const children = findPageChildren(itemsList.value, normalizedPath.value);
const breadcrumbs = findPageBreadcrumb(itemsList.value, normalizedPath.value, {
  current: true,
});

const siteConfig = useSiteConfig();
const url = useRequestURL();
const ogImageUrl = page?.ogImage
  ? `${url.origin}${page?.ogImage}`
  : encodeURI(`${url.origin}/api/screenshot?path=${route.path}`);

useSeoMeta({
  ...(page?.seo || {}),
  ogTitle: page?.title,
  ogDescription: page?.description,
  ogUrl: `${url.origin}${route.path}`,
  ogType: "website",
  ogImageUrl: ogImageUrl,
  ogImageWidth: 720,
  ogImageHeight: 377,
  ogImageType: "image/png",
  ogImageAlt: page?.title,
  twitterCard: "summary_large_image",
  twitterTitle: page?.title,
  twitterDescription: page?.description,
  twitterImage: ogImageUrl,
  twitterImageWidth: 720,
  twitterImageHeight: 377,
  twitterImageAlt: page?.title,
  twitterSite: "@SaadBatwa",
  twitterCreator: "@SaadBatwa",
});
</script>

<template>
  <template v-if="breadcrumbs.length > 1">
    <Breadcrumb class="mb-4 screenshot-hidden">
      <BreadcrumbList>
        <div
          class="contents"
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
        >
          <BreadcrumbItem>
            <template v-if="index !== breadcrumbs.length - 1">
              <BreadcrumbLink as-child>
                <NuxtLink :to="breadcrumb.path">
                  {{ breadcrumb.title }}
                </NuxtLink>
              </BreadcrumbLink>
            </template>
          </BreadcrumbItem>
          <template v-if="index < breadcrumbs.length - 2">
            <BreadcrumbSeparator />
          </template>
        </div>
      </BreadcrumbList>
    </Breadcrumb>
  </template>

  <template v-if="page">
    <ContentRenderer :value="page" class="typography" />
  </template>

  <template v-if="page">
    <Button as-child variant="link" class="mt-4 screenshot-hidden">
      <NuxtLink
        :to="`${siteConfig.github}/content/${page?.stem}.${page?.extension}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Pencil />
        <span>تعديل هذه الصفحة</span>
      </NuxtLink>
    </Button>
  </template>

  <template v-if="!page && children">
    <div class="typography">
      <h1 class="flex items-center gap-2">
        <template v-if="pageItem?.icon">
          <Icon :name="pageItem.icon" class="!size-8" />
        </template>
        {{ breadcrumbs.at(-1)?.title }}
      </h1>
      <div
        class="grid grid-cols-[repeat(auto-fill,minmax(min(20rem,80dvw),1fr))] gap-4"
      >
        <PageCard
          v-for="child in children"
          :key="child.path"
          :href="child.path"
        >
          <template v-if="child.icon">
            <Icon :name="child.icon" class="!size-8 me-1" />
          </template>
          {{ child.title }}
        </PageCard>
      </div>
    </div>
  </template>
</template>
