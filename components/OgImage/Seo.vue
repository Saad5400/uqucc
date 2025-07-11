<script setup lang="ts">
const props = defineProps<{
    title?: string;
    description?: string;
}>();

const titleRender = h('div', { class: 'text-[#298287] flex flex-row-reverse flex-wrap text-7xl pr-12' }, props.title?.split(' ').map(word => {
    return h('span', { style: `width: ${word.length * 32}px` }, word);
}))

const descriptionRender = h('div', { class: 'mt-10 flex flex-row-reverse flex-wrap text-5xl px-12' }, props.description?.split(' ').map(word => {
    return h('span', { style: `width: ${(word.length + 2) * 20}px`, class: 'py-1' }, word);
}))
</script>

<template>
    <div
    class="flex absolute top-0 right-[-100%]"
    style="
        width: 200%;
        height: 200%;
        background-image: radial-gradient(circle, rgba(41, 130, 135, 0.5) 0%, rgba(5, 5, 5, 0.3) 50%, (5, 5, 5, 0) 70%);
    "
    />
    <div class="px-4 py-16 text-white/80">
        <component :is="titleRender" />
        <component :is="descriptionRender" />
    </div>
</template>
