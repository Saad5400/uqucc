<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
const { data: items } = await useContentNavigation();
</script>

<template>
  <div
    class="grid gap-2 grid-cols-[repeat(auto-fill,minmax(min(14rem,80dvw),1fr))] mb-8"
  >
    <PageCard
      v-for="item in items?.filter((i) => i.children)"
      class="px-4 py-2 text-lg"
      :key="item.title"
      :href="item.path"
    >
      <Icon v-if="item.icon" :name="item.icon" class="!size-8 me-1" />
      {{ item.title }}
    </PageCard>
  </div>
</template>
