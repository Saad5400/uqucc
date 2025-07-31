<script setup lang="ts">
const page = await useCurrentPage();
</script>

<template>
  <h1 class="flex items-center gap-2">
    <template v-if="page?.icon">
      <Icon :name="page.icon" class="!size-8" />
    </template>
    <slot />
  </h1>
</template>
