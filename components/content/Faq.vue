<script setup lang="ts"></script>

<template>
  <Collapsible class="max-w-[40rem]">
    <CollapsibleTrigger
      class="text-base text-foreground/80 w-full border-2 whitespace-normal break-words h-fit text-start justify-between my-0"
      as-child
    >
      <Button variant="secondary">
        <slot mdc-unwrap="p" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent class="ms-3 rounded-b-xl bg-secondary/60 shadow">
      <div class="ps-4">
        <slot name="content" mdc-unwrap="p, ul" />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
