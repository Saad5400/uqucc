<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';
import SidebarMenuList from '~/components/layout/sidebar/SidebarMenuList.vue';

const { data: items } = await useAsyncData('navigation', () =>
    queryCollectionNavigation('docs')
);

const colorMode = useColorMode();
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
        <div class="flex-1 p-2 space-y-4">
            <header
                class="flex items-center justify-between w-full gap-2 p-2 border rounded-lg shadow-sm bg-sidebar border-sidebar-border">
                <div class="flex items-center gap-2">
                    <Button as-child variant="ghost" size="icon">
                        <SidebarTrigger />
                    </Button>
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <NuxtImg class="size-6" src="/favicon.svg" />
                        <span>
                            دليل طالب كلية الحاسبات
                        </span>
                    </NuxtLink>
                </div>
                <ClientOnly class="flex items-center gap-2">
                    <Button v-if="colorMode.value === 'dark'" @click="colorMode.preference = 'light'" variant="ghost"
                        size="icon">
                        <Moon />
                    </Button>
                    <Button v-if="colorMode.value === 'light'" @click="colorMode.preference = 'dark'" variant="ghost"
                        size="icon">
                        <Sun />
                    </Button>

                    <template #fallback>
                        <Button class="skeleton" variant="ghost" size="icon">
                            <Skeleton class="size-full" />
                        </Button>
                    </template>
                </ClientOnly>
            </header>
            <main style="max-width: calc(100dw - 1rem);"
                class="w-full p-4 border rounded-lg shadow-sm bg-sidebar border-sidebar-border">
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
