<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const props = defineProps<{
    pages: string[];
}>();
const { data: items } = await useContentNavigation();

function findItemByTitle(title: string, items: ContentNavigationItem[] | null): ContentNavigationItem | undefined {
    if (!items) return undefined;

    for (const item of items) {
        if (item.title === title) {
            return item;
        }

        if (item.children) {
            const found = findItemByTitle(title, item.children);
            if (found) {
                return found;
            }
        }
    }
}
</script>

<template>
    <div class="grid gap-2 grid-cols-[repeat(auto-fill,minmax(min(12rem,80dvw),1fr))] mb-8">
        <PageCard v-for="page in props.pages" class="px-4 py-2 text-base" :key="page"
            :href="findItemByTitle(page, items)?.path || ''">
            {{ findItemByTitle(page, items)?.title }}
        </PageCard>
    </div>
</template>
