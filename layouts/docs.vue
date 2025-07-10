<script setup lang="ts">
import SidebarMenuList from '@/components/layout/SidebarMenuList.vue';

const { data: items } = await useAsyncData('navigation', () =>
    queryCollectionNavigation('docs')
);
</script>

<template>
    <SidebarProvider>
        <Sidebar side="right" variant="floating">
            <SidebarHeader />
            <SidebarContent style="scrollbar-gutter: stable;">
                <SidebarGroup>
                    <SidebarMenu>
                        <ClientOnly>
                            <SidebarMenuList :items="items || []" />
                            <template #fallback>
                                <SidebarMenuItem v-for="i in 10" :key="i">
                                    <SidebarMenuSkeleton />
                                </SidebarMenuItem>
                            </template>
                        </ClientOnly>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
        <div class="p-2 flex-1 space-y-4">
            <header
                class="flex items-center gap-2 justify-start p-2 bg-sidebar border-sidebar-border w-full rounded-lg border shadow-sm">
                <Button as-child variant="ghost" size="icon">
                    <SidebarTrigger />
                </Button>
                <div class="flex items-center gap-2">
                    <NuxtImg class="size-6" src="/favicon.svg" />
                    <span>
                        دليل طالب كلية الحاسبات
                    </span>
                </div>
            </header>
            <main class="bg-sidebar border-sidebar-border w-full rounded-lg border shadow-sm">
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
