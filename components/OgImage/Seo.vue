<script setup lang="ts">
const props = defineProps<{
    title?: string;
    description?: string;
}>();

const titleRender = h('div', { class: 'flex flex-row-reverse flex-wrap text-7xl pr-18' }, props.title?.split(' ').map(word => {
    return h('span', { style: `width: ${word.length * 32}px` }, word);
}))

const descriptionRender = h('div', { class: 'flex flex-row-reverse flex-wrap text-5xl px-18' }, props.description?.split(' ').map(word => {
    return h('span', { style: `width: ${(word.length + 2) * 20}px`, class: 'py-1' }, word);
}))
</script>

<template>
    <div class="px-4 py-16 text-[#298287] bg-black size-full">
        <!-- <component :is="titleRender" /> -->
        <component :is="descriptionRender" />
    </div>
</template>
