<script setup lang="ts">
const { data: items } = await useAsyncData('navigation', () =>
    queryCollectionNavigation('docs')
);
</script>

<template>
    <SidebarProvider>
        <Sidebar side="right">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in items || []" :key="item.stem" :to="`/${item.slug}`">
                            <SidebarMenuButton as-child>
                                <NuxtLink :to="item.path">
                                    {{ item.title }}
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
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