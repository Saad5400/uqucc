<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';

const colorMode = useColorMode();
</script>

<template>
    <header
        class="flex items-center justify-between w-full gap-2 p-2 border rounded-lg shadow-sm bg-sidebar border-sidebar-border">
        <div class="flex items-center">
            <Button as-child variant="ghost" size="icon" class="md:hidden">
                <SidebarTrigger />
            </Button>
            <NuxtLink to="/" class="flex items-center gap-2 ms-2">
                <NuxtImg class="size-6" src="/favicon.svg" />
                <span>
                    دليل طالب كلية الحاسبات
                </span>
            </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
            <SearchBar />
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
        </div>
    </header>
</template>