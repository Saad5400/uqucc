<script setup lang="ts">
import MiniSearch from 'minisearch'

const query = ref('')
const { data } = await useAsyncData('search', () => queryCollectionSearchSections('docs'))

const miniSearch = new MiniSearch({
    fields: ['title', 'content'],
    storeFields: ['title', 'content'],
    searchOptions: {
        prefix: true,
        fuzzy: 2,
    },
})

// Add data to the MiniSearch instance
miniSearch.addAll(toValue(data.value) || [])
const links = computed(() => miniSearch.search(toValue(query)))
const uniqueLinks = computed(() => {
    const seen = new Set<string>()
    return links.value.filter(link => {
        if (seen.has(link.title)) return false
        seen.add(link.title)
        return true
    })
})
</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="outline">
                ابحث في الدليل
            </Button>
        </DialogTrigger>
        <DialogContent>
            <Input class="border-card-foreground/30" v-model="query" placeholder="بحث ..." />
            <div class="flex flex-col gap-2 overflow-y-auto h-96">
                <Button variant="ghost" v-for="link of uniqueLinks" :key="link.id" as-child
                    class="flex flex-col items-start whitespace-normal h-fit hover:!bg-card-foreground/10">
                    <NuxtLink class="w-full" :to="link.id">
                        <h5 class="font-semibold text-start">
                            {{ link.title }}
                        </h5>
                        <p v-if="link.content" class="text-xs text-start text-foreground/70 line-clamp-2">
                            {{ link.content }}
                        </p>
                    </NuxtLink>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>
