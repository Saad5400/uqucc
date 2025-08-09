<script setup lang="ts">
import { authors } from "~/lib/authors";
import ProseA from "./prose/ProseA.vue";

interface Author {
  name: string;
  url?: string;
}

const authorsList = computed(() => {
  return authors ? (Object.values(authors) as Author[]) : [];
});
</script>

<template>
  <ul>
    <li v-for="author in authorsList" :key="author.name">
      <ProseA v-if="author.url" :href="author.url" target="_blank">
        {{ author.name }}
      </ProseA>
      <span v-else>{{ author.name }}</span>
    </li>
  </ul>
</template>
