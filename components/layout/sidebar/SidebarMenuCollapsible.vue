<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import SidebarMenuList from "./SidebarMenuList.vue";
import { ChevronLeft } from "lucide-vue-next";
import SidebarMenuLink from "./SidebarMenuLink.vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  item: ContentNavigationItem;
}>();
const route = useRoute();
const open = ref(false);

watch(
  () => route.path,
  (newPath) => {
    open.value = newPath.includes(props.item.path);
  },
  { immediate: true }
);
</script>

<template>
  <Collapsible v-model:open="open">
    <SidebarMenuItem>
      <div class="flex items-center justify-between gap-1">
        <SidebarMenuLink :item="item" />
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            aria-label="فتح/إغلاق القائمة"
            :class="
              cn(
                'flex items-center justify-center w-fit',
                open && 'bg-sidebar-accent'
              )
            "
          >
            <ChevronLeft
              :class="cn('transition-transform size-4', open && '-rotate-90')"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
      </div>
    </SidebarMenuItem>

    <CollapsibleContent class="my-2 ps-2 ms-2 border-s-1 border-foreground/30">
      <!-- *** RECURSION happens here *** -->
      <SidebarMenuList :items="item.children ?? []" />
    </CollapsibleContent>
  </Collapsible>
</template>
