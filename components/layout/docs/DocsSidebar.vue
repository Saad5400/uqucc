<script setup lang="ts">
import SidebarMenuList from "~/components/layout/sidebar/SidebarMenuList.vue";

const { data: items } = await useContentNavigation();
</script>

<template>
  <Sidebar side="right" variant="floating">
    <SidebarHeader />
    <SidebarContent style="scrollbar-gutter: stable">
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
</template>
