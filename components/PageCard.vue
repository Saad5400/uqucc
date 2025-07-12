<script setup lang="ts">
import { cn } from '~/lib/utils';

const props = defineProps<{
    href: string;
    class?: string;
}>();
</script>

<template>
    <Button as-child variant="secondary"
        :class="cn('p-8 text-2xl text-center whitespace-normal size-full', props.class)">
        <NuxtLink :to="href">
            <slot />
        </NuxtLink>
    </Button>
</template>