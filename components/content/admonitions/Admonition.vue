<script setup lang="ts">
import { Info } from 'lucide-vue-next';
</script>

<template>
    <Alert>
        <slot name="icon">
            <Info />
        </slot>
        <AlertTitle class="my-0 [&>ul]:my-0">
            <slot />
        </AlertTitle>
    </Alert>
</template>
