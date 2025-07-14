import { ContentNavigationItem } from "@nuxt/content";

export default defineCachedEventHandler(
  async (event) => {
    const { collection, query }: { collection: string; query: string } =
      getQuery(event);

    if (!collection || !query) {
      throw createError({
        statusCode: 400,
        statusMessage: "Collection and query parameters are required",
      });
    }

    // @ts-ignore
    const navigation = await queryCollectionNavigation(event, collection);

    function normalizeText(input: string): string {
      let text = input;

      // 1. Normalize Unicode to NFC form
      text = text.normalize("NFC");

      // 2. Remove tashkeel (diacritics)
      text = text.replace(
        /[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/g,
        ""
      );

      // 3. Remove tatweel (kashida)
      text = text.replace(/ـ/g, "");

      // 4. Unify Alef variants to bare Alef
      text = text.replace(/[إأآا]/g, "ا");

      // 5. Normalize Yeh and Alef Maqsura
      text = text.replace(/ى/g, "ي");

      // 6. Normalize Hamza forms to bare Hamza
      text = text.replace(/[ؤئ]/g, "ء");

      // 7. Remove the definite article "ال" at the start of words
      //    Matches "ال" at string-start or after whitespace
      text = text.replace(/(^|\s)ال(?=[\u0621-\u064A])/g, "$1");

      // 8. Remove common punctuation and symbols
      text = text.replace(
        /[\u060C\u061B\u061F\u066A-\u066D\u06D4.,\/#!$%\^&\*;:{}=\-_`~()«»؟؟…]/g,
        ""
      );

      // 9. Collapse multiple spaces into one, trim ends
      text = text.replace(/\s+/g, " ").trim();

      return text;
    }

    const searchByStem = (
      query: string,
      items: ContentNavigationItem[]
    ): ContentNavigationItem | undefined => {
      for (const item of items) {
        // the item.stem is the relative path, e.g. "stem": "التقنية والاجهزة/ايباد او لابتوب". But I only want the filename which is the last part of the stem after the last slash
        const fileName = item.stem ? item.stem.split("/").pop() : "";
        if (normalizeText(fileName ?? "") == normalizeText(query)) {
          return item;
        }

        if (item.children) {
          const found = searchByStem(query, item.children);
          if (found) {
            return found;
          }
        }
      }
    };

    const result = searchByStem(query, navigation);

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: "No matching item found",
      });
    }

    return result;
  },
  {
    maxAge: 60 * 60 * 4, // Cache for 4 hours
  }
);
