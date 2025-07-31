<script setup lang="ts">
import { cn } from "~/lib/utils";

const props = defineProps<{
  name: string;
  class?: string;
}>();
</script>

<template>
  <div class="flex w-full items-center gap-2 my-0">
    <Icon :name="props.name" :class="cn('my-0 !size-6', props.class)" />
    <slot />
  </div>
</template>
