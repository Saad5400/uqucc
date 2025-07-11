<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';
import { useSidebar } from '~/components/ui/sidebar';

const props = defineProps<{
    item: ContentNavigationItem,
}>();
const router = useRouter();
const sidebar = useSidebar();
</script>

<template>
    <SidebarMenuButton class="h-full text-start" as-child :is-active="router.currentRoute.value.path === item.path">
        <NuxtLink :to="item.path" @click="sidebar.setOpenMobile(false)">{{ item.title }}</NuxtLink>
    </SidebarMenuButton>
</template>