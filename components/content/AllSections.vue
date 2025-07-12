<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';
const { data: items } = await useContentNavigation();
</script>

<template>
    <div class="grid gap-2 grid-cols-[repeat(auto-fill,minmax(min(12rem,80dvw),1fr))] mb-8">
        <PageCard 
            v-for="item in items?.filter(i => i.children)"
            class="px-4 py-2 text-base" 
            :key="item.title" 
            :href="item.path"
        >
            {{ item.title }}
        </PageCard>
    </div>
</template>
