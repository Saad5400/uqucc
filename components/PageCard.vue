<script setup lang="ts">
const props = defineProps<{
    title: string;
    href: string;
}>();
</script>

<template>
    <Button as-child variant="secondary" class="p-8 text-2xl text-center whitespace-normal size-full">
        <NuxtLink :to="href">
            {{ props.title }}
        </NuxtLink>
    </Button>
</template>