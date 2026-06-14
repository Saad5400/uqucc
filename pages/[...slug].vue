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
const siteName = siteConfig.name || "دليل طالب كلية الحاسبات";
const url = useRequestURL();
const ogImageUrl = page?.ogImage
  ? `${url.origin}${page?.ogImage}`
  : encodeURI(`${url.origin}/api/screenshot?path=${route.path}`);

// Resolve a meaningful, unique title/description for this page.
const sectionTitle = computed(() => breadcrumbs.at(-1)?.title);
const pageTitle = computed(
  () => page?.title || pageItem?.title || sectionTitle.value || siteName
);
const canonicalUrl = computed(
  () => `${siteConfig.url}${normalizedPath.value || "/"}`
);

// Build a clean description: prefer the page description, then a sentence
// derived from the section/title, falling back to the site description.
function plainText(value: unknown): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}
const pageDescription = computed(() => {
  const fromPage = plainText(page?.description);
  if (fromPage) return fromPage;
  const title = plainText(pageTitle.value);
  if (title && title !== siteName) {
    return `${title} — ${siteName}: دليلك الشامل لكل ما يخص كلية الحاسبات.`;
  }
  return "دليلك الشامل لكل ما يخص كلية الحاسبات من تخصصات ومقررات وأدوات ونصائح، بكتابة الطلاب للطلاب.";
});

useSeoMeta({
  ...(page?.seo || {}),
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: canonicalUrl,
  ogType: page ? "article" : "website",
  ogImageUrl: ogImageUrl,
  ogImageWidth: 720,
  ogImageHeight: 377,
  ogImageType: "image/png",
  ogImageAlt: pageTitle,
  twitterCard: "summary_large_image",
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: ogImageUrl,
  twitterImageWidth: 720,
  twitterImageHeight: 377,
  twitterImageAlt: pageTitle,
  twitterSite: "@SaadBatwa",
  twitterCreator: "@SaadBatwa",
});

useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
});

// Structured data: BreadcrumbList for every page, plus Article on content pages.
const jsonLd = computed(() => {
  const graph: Record<string, unknown>[] = [];

  if (breadcrumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteName,
          item: `${siteConfig.url}/`,
        },
        ...breadcrumbs
          .filter((b) => b.path && b.path !== "/")
          .map((b, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name: b.title,
            item: `${siteConfig.url}${b.path}`,
          })),
      ],
    });
  }

  if (page) {
    graph.push({
      "@type": "TechArticle",
      headline: pageTitle.value,
      description: pageDescription.value,
      inLanguage: "ar",
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl.value },
      image: ogImageUrl,
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      publisher: { "@id": `${siteConfig.url}/#organization` },
      ...(page?.authors?.length
        ? {
            author: page.authors.map((name: string) => ({
              "@type": "Person",
              name,
            })),
          }
        : {}),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() => JSON.stringify(jsonLd.value)),
    },
  ],
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
