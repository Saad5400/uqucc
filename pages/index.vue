<script setup lang="ts">
defineOgImageComponent('NuxtSeo')

const today = new Date();
const payDay = new Date(today.getFullYear(), today.getMonth(), 27);
const timeToPay = payDay.getTime() - today.getTime();
const daysToPay = Math.ceil(timeToPay / (1000 * 60 * 60 * 24));

useSeoMeta({
  title: `${daysToPay} Days Until Payday`,
  description: `There are ${daysToPay} days left until payday.`,
})
</script>

<template>
  Days until payday: {{ daysToPay }}
</template>
