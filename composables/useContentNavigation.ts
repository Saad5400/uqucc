import type { ContentNavigationItem } from "@nuxt/content";

export const useContentNavigation = async () =>
  useAsyncData("navigation", async () => {
    const data = (await queryCollectionNavigation("docs", [
      "order",
      "icon",
    ]).where("hidden", "IS NULL")) as (ContentNavigationItem & {
      order: number;
      icon: string;
    })[];

    return data.sort((a, b) => a.order - b.order);
  });
