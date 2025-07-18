<script setup lang="ts">
import DocsSidebar from "~/components/layout/docs/DocsSidebar.vue";
import Navbar from "~/components/layout/docs/DocsNavbar.vue";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css"; // vue-sonner v2 requires this import
import { toast } from "vue-sonner";

const { data: items } = await useContentNavigation();

onMounted(() => {
  if (new Date().getDay() === 5) toast.info("اللهم صل وسلم على نبينا محمد");
});
</script>

<template>
  <SidebarProvider>
    <DocsSidebar :items="items" />
    <div
      class="flex-1 p-2 space-y-4 max-w-[calc(100dvw)] md:max-w-[calc(100dvw-var(--sidebar-width))]"
    >
      <Navbar />
      <main
        class="w-full p-4 border rounded-lg shadow-sm bg-sidebar border-sidebar-border"
      >
        <slot />
        <Toaster />
      </main>
    </div>
  </SidebarProvider>
</template>

<style scoped>
main {
  min-height: calc(100dvh - 5.5rem);
}
</style>
