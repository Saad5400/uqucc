import { ContentNavigationItem } from "@nuxt/content";

export default defineEventHandler(async (event) => {
    const { collection, query }: { collection: string, query: string } = getQuery(event);

    if (!collection || !query) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Collection and query parameters are required',
        });
    }

    // @ts-ignore
    const navigation = await queryCollectionNavigation(event, collection);

    const normalizeText = (text: string): string => {
        // normalize arabic text, meaning replace أ إ آ .. etc with ا, and like so
        return text
            .replace(/[\u0621\u0622\u0623\u0624\u0625\u0626\u0627\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u0630\u0631\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A]/g, 'ا')
            .replace(/[\u0641\u0642\u0643\u0644\u0645\u0646\u0647]/g, 'ف')
            .replace(/[\u0648]/g, 'و')
            .replace(/[\u064A]/g, 'ي')
            .replace(/^(ال|أل)\s*/g, '')
            .trim()
            .toLowerCase();
    }

    const searchByStem = (query: string, items: ContentNavigationItem[]): ContentNavigationItem | undefined => {
        for (const item of items) {
            // the item.stem is the relative path, e.g. "stem": "التقنية والاجهزة/ايباد او لابتوب". But I only want the filename which is the last part of the stem after the last slash
            const fileName = item.stem ? item.stem.split('/').pop() : '';
            if (normalizeText(fileName ?? '') == normalizeText(query)) {
                return item;
            }

            if (item.children) {
                const found = searchByStem(query, item.children);
                if (found) {
                    return found;
                }
            }
        }
    }

    const result = searchByStem(query, navigation);

    if (!result) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No matching item found',
        });
    }

    return result;
})
