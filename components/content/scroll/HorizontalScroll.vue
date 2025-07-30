<template>
  <ScrollArea class="whitespace-nowrap max-w-[87dvw] md:max-w-[calc(100dvw-26rem)]">
    <div class="flex gap-2">
      <slot></slot>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>
