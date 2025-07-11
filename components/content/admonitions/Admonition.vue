<script setup lang="ts">
import { Info } from 'lucide-vue-next';
</script>

<template>
    <Alert>
        <slot name="icon">
            <Info />
        </slot>
        <AlertTitle>
            <slot />
        </AlertTitle>
    </Alert>
</template>
