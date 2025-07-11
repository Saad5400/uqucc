<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next';

</script>

<template>
    <Admonition>
        <template #icon>
            <Lightbulb />
        </template>
        <slot mdc-unwrap="p" />
    </Admonition>
</template>
