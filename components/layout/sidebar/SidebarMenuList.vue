<script lang="ts" setup>
import type { ContentNavigationItem } from '@nuxt/content';
import SidebarMenuLink from './SidebarMenuLink.vue';
import SidebarMenuCollapsible from './SidebarMenuCollapsible.vue';

defineProps<{
    items: ContentNavigationItem[],
}>()
</script>


<template>
    <ul class="space-y-1">
        <li v-for="item in items" :key="item.stem">
            <!-- leaf node -->
            <SidebarMenuItem v-if="!item.children || !item.children.length">
                <SidebarMenuLink :item="item" />
            </SidebarMenuItem>

            <!-- node with children -->
            <SidebarMenuCollapsible v-else :item="item" />
        </li>
    </ul>
</template>