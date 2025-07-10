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
            <SidebarContent>
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
        <main>
            <Button as-child variant="ghost" size="icon">
                <SidebarTrigger />
            </Button>
            <slot />
        </main>
    </SidebarProvider>
</template>