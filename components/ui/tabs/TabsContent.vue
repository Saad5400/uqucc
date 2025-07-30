<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { TabsContent, type TabsContentProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  TabsContentProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <TabsContent
    data-slot="tabs-content"
    :class="
      cn(
        'flex-1 outline-none border-2 bg-border/50 rounded-lg px-4 my-0 shadow',
        props.class
      )
    "
    v-bind="delegatedProps"
    style="direction: rtl"
  >
    <slot />
  </TabsContent>
</template>
