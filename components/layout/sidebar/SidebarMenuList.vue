<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next';
import type { ContentNavigationItem } from '@nuxt/content';
import SidebarMenuLink from './SidebarMenuLink.vue';

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
            <Collapsible v-else class="group">
                <SidebarMenuItem>
                    <div class="flex items-center justify-between">
                        <SidebarMenuLink :item="item" />
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton class="w-fit">
                                <ChevronLeft class="size-4 group-data-[state=open]:-rotate-90 transition-transform" />
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