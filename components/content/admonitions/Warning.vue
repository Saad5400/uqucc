<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next';

</script>

<template>
    <Admonition>
        <template #icon>
            <CircleAlert />
        </template>
        <slot mdc-unwrap="p" />
    </Admonition>
</template>
