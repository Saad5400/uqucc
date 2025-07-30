<script setup lang="ts">
import slugify from "slugify";

const props = defineProps<{
  items: string[];
}>();
</script>

<template>
  <Tabs :default-value="slugify(items[0])">
    <TabsList class="max-w-[87dvw] md:max-w-[calc(100dvw-26rem)] mb-0">
      <TabsTrigger
        v-for="item in items"
        :key="slugify(item)"
        :value="slugify(item)"
      >
        {{ item }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      class="max-w-[87dvw] md:max-w-[calc(100dvw-26rem)]"
      v-for="(item, index) in items"
      :key="slugify(item)"
      :value="slugify(item)"
    >
      <slot :name="`item-${index}`"></slot>
    </TabsContent>
  </Tabs>
</template>
