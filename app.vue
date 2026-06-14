<script setup lang="ts">
const siteConfig = useSiteConfig();
const siteUrl = siteConfig.url;
const siteName = siteConfig.name || "دليل طالب كلية الحاسبات";
const siteDescription =
  "دليلك الشامل لكل ما يخص كلية الحاسبات من تخصصات ومقررات وأدوات ونصائح، بكتابة الطلاب للطلاب.";

useHead({
  htmlAttrs: {
    dir: "rtl",
    lang: "ar",
  },
  titleTemplate: (title) =>
    title && title !== siteName ? `${title} - ${siteName}` : siteName,
  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico", sizes: "any" },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
  meta: [{ name: "theme-color", content: "#298287" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: `${siteUrl}/`,
            name: siteName,
            description: siteDescription,
            inLanguage: "ar",
            publisher: { "@id": `${siteUrl}/#organization` },
          },
          {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: siteName,
            url: `${siteUrl}/`,
            description: siteDescription,
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/web-app-manifest-512x512.png`,
            },
            sameAs: [
              "https://github.com/Saad5400/uqucc",
              "https://t.me/uqucc_chat",
            ],
          },
        ],
      }),
    },
  ],
});

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogSiteName: siteName,
  ogLocale: "ar_AR",
});
</script>

<template>
  <NuxtLayout name="docs">
    <NuxtPage />
  </NuxtLayout>
</template>
