export const useContentNavigation = async () =>
    useAsyncData('navigation', () => queryCollectionNavigation('docs').where('hidden', 'IS NULL'));
