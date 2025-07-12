<script setup lang="ts">
import DocsSidebar from '~/components/layout/docs/DocsSidebar.vue';
import Navbar from '~/components/layout/docs/DocsNavbar.vue';

const { data: items } = await useContentNavigation();
</script>

<template>
    <SidebarProvider>
        <DocsSidebar :items="items" />
        <div class="flex-1 p-2 space-y-4 max-w-[calc(100dvw)] md:max-w-[calc(100dvw-var(--sidebar-width))]">
            <Navbar />
            <main class="w-full p-4 border rounded-lg shadow-sm bg-sidebar border-sidebar-border">
                <slot />
            </main>
        </div>
    </SidebarProvider>
</template>

<style scoped>
main {
    min-height: calc(100dvh - 5.5rem);
}
</style>
