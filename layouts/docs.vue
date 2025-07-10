<script setup lang="ts">
import { ChevronLeft, ChevronDown, Star } from 'lucide-vue-next';

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
                        <div class="contents" v-for="item in items || []" :key="item.stem" :to="`/${item.slug}`">
                            <SidebarMenuItem v-if="!item.children || item.children.length === 0">
                                <SidebarMenuButton as-child>
                                    <NuxtLink :to="item.path">
                                        {{ item.title }}
                                    </NuxtLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <Collapsible v-else class="group/collapsible">
                                <SidebarMenuItem>
                                    <div class="flex items-center justify-between">
                                        <SidebarMenuButton as-child>
                                            <NuxtLink class="w-full" :to="item.path">
                                                {{ item.title }}
                                            </NuxtLink>
                                        </SidebarMenuButton>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton class="size-fit">
                                                <ChevronLeft class="size-4" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                    </div>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem />
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </div>
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