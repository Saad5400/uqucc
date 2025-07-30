<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { TabsList, type TabsListProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  TabsListProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-sidebar-ring/10 dark:bg-sidebar-accent text-sidebar-accent-foreground inline-flex size-fit overflow-x-auto items-center rounded-lg px-2',
        props.class
      )
    "
    style="direction: rtl !important; scrollbar-width: thin"
    dir="rtl"
  >
    <slot />
  </TabsList>
</template>
