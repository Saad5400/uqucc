<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';

const colorMode = useColorMode();
</script>

<template>
    <header
        class="flex items-center justify-between w-full gap-2 p-2 border rounded-lg shadow-sm bg-sidebar border-sidebar-border">
        <div class="flex items-center">
            <Button aria-label="فاتح القائمة" as-child variant="ghost" size="icon" class="md:hidden">
                <SidebarTrigger />
            </Button>
            <NuxtLink to="/" class="flex items-center gap-2 ms-2">
                <NuxtImg alt="الشعار" class="size-6" src="/favicon.svg" />
                <span>
                    دليل طالب كلية الحاسبات
                </span>
            </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
            <SearchBar />
            <ClientOnly class="flex items-center gap-2">
                <Button aria-label="تبديل إلى الوضع الفاتح" v-if="colorMode.value === 'dark'" @click="colorMode.preference = 'light'" variant="ghost"
                    size="icon">
                    <Moon />
                </Button>
                <Button aria-label="تبديل إلى الوضع الداكن" v-if="colorMode.value === 'light'" @click="colorMode.preference = 'dark'" variant="ghost"
                    size="icon">
                    <Sun />
                </Button>

                <template #fallback>
                    <Button aria-label="تحميل" class="skeleton" variant="ghost" size="icon">
                        <Skeleton class="size-full" />
                    </Button>
                </template>
            </ClientOnly>
        </div>
    </header>
    <NuxtLoadingIndicator color="var(--primary)" />
</template>