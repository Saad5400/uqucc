export const useContentNavigation = async () =>
  useAsyncData("navigation", () =>
    queryCollectionNavigation("docs", ["order", "icon"])
      .where("hidden", "IS NULL")
      .order("order", "ASC")
  );
