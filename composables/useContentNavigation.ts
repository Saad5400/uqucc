export const useContentNavigation = async () =>
    useAsyncData('navigation', () => queryCollectionNavigation('docs'));
