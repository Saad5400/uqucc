<template>
  <h4 :id="slugify(props.id || '')">
    <a
      class="text-foreground font-normal"
      v-if="props.id && generate"
      :href="`#${slugify(props.id)}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h4>
</template>

<script setup lang="ts">
import slugify from "slugify";

const props = defineProps<{ id?: string }>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(
  () =>
    props.id &&
    ((typeof headings?.anchorLinks === "boolean" &&
      headings?.anchorLinks === true) ||
      (typeof headings?.anchorLinks === "object" && headings?.anchorLinks?.h4))
);
</script>
