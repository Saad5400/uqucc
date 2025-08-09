<script setup lang="ts">
import { authors } from "~/lib/authors";
import ProseA from "./ProseA.vue";

const page = await useCurrentPage();
// @ts-ignore
const getAuthor = (author: string) => authors[author];
</script>

<template>
  <h1 class="flex items-start justify-between gap-4">
    <div class="flex items-center gap-2">
      <template v-if="page?.icon">
        <Icon :name="page.icon" class="!size-8" />
      </template>
      <slot />
    </div>
    <div class="text-sm text-muted-foreground" v-if="page?.authors">
      كتب بقلم:
      <template v-for="(author, index) in page.authors">
        <ProseA
          :href="getAuthor(author).url"
          target="_blank"
          v-if="getAuthor(author).url"
        >
          {{ getAuthor(author).name }}
        </ProseA>
        <span v-else>
          {{ getAuthor(author).name }}
        </span>
        <template v-if="index < page.authors.length - 1">, </template>
      </template>
    </div>
  </h1>
</template>
