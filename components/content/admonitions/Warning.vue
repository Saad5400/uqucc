<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next';

</script>

<template>
    <Admonition>
        <template #icon>
            <CircleAlert class="my-0" />
        </template>
        <slot mdc-unwrap="p" />
    </Admonition>
</template>
