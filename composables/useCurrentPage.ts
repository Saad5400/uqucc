export const useCurrentPage = async () => {
  const route = useRoute();

  const { data, error } = await useAsyncData(`page:${route.path}`, () =>
    queryCollection("docs").path(route.path).first()
  );

  if (error.value) {
    console.error("Failed to fetch page data", error.value);
    return null;
  }

  return data.value || null;
};
