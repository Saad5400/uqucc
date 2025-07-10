<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next';
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
    items: ContentNavigationItem[],
}>()
</script>


<template>
    <ul class="space-y-1">
        <li v-for="item in items" :key="item.stem">
            <!-- leaf node -->
            <SidebarMenuItem v-if="!item.children || !item.children.length">
                <SidebarMenuButton as-child>
                    <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <!-- node with children -->
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
                </SidebarMenuItem>

                <CollapsibleContent class="ps-2 ms-2 border-s-1 border-foreground/30">
                    <!-- *** RECURSION happens here *** -->
                    <SidebarMenuList :items="item.children" />
                </CollapsibleContent>
            </Collapsible>
        </li>
    </ul>
</template>