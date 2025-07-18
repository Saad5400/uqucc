<script setup lang="ts">
import Fuse from "fuse.js";
import { Search } from "lucide-vue-next";

const query = ref("");
const { data } = await useAsyncData("search-data", () =>
  queryCollectionSearchSections("docs")
);

// @ts-ignore
const fuse = new Fuse(data.value, {
  keys: ["title", "content"],
});

const results = computed(() => fuse.search(toValue(query)).slice(0, 10));
const uniqueResults = computed(() => {
  const seen = new Set();
  return results.value.filter((result) => {
    if (seen.has(result.item.title)) {
      return false;
    }
    seen.add(result.item.title);
    return true;
  });
});

function handleOpenChange() {
  open.value = !open.value;
}

const handleNavigate = () => {
  if (uniqueResults.value.length > 0) {
    const firstResult = uniqueResults.value[0].item.id;
    open.value = false;
    navigateTo(firstResult);
  }
};

const open = ref(false);
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">
        <Search />
        ابحث
      </Button>
    </DialogTrigger>
    <DialogContent>
      <Input
        @keyup.enter="handleNavigate"
        @keyup.esc="open = false"
        type="search"
        class="border-card-foreground/30"
        v-model="query"
        placeholder="بحث ..."
      />
      <div class="flex flex-col gap-2 overflow-y-auto h-96 p-1">
        <Button
          variant="ghost"
          v-for="link of uniqueResults"
          :key="link.item.id"
          as-child
          @click="open = false"
          class="flex flex-col w-full items-start whitespace-normal h-fit hover:!bg-card-foreground/10"
        >
          <NuxtLink class="w-full" :to="link.item.id">
            <h5 class="font-semibold text-start">
              {{ link.item.title }}
            </h5>
            <p
              v-if="link.item.content"
              class="text-xs text-start text-foreground/70 line-clamp-2"
            >
              {{ link.item.content }}
            </p>
          </NuxtLink>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
