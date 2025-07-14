import { ContentNavigationItem } from "@nuxt/content";

export default defineCachedEventHandler(
  async (event) => {
    const { collection }: { collection: string } = getQuery(event);

    if (!collection) {
      throw createError({
        statusCode: 400,
        statusMessage: "Collection parameter is required",
      });
    }

    // @ts-ignore
    const navigation = await queryCollectionNavigation(event, collection);

    const navigationNames: string[] = [];

    function collectNames(items: ContentNavigationItem[]) {
      for (const item of items) {
        if (item.stem) {
          navigationNames.push(item.stem.split("/").pop() || "");
        }
        if (item.children) {
          collectNames(item.children);
        }
      }
    }

    collectNames(navigation);

    if (navigationNames.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "No items found in the collection",
      });
    }

    return navigationNames;
  },
  {
    maxAge: 60 * 60 * 4, // Cache for 4 hours
  }
);
