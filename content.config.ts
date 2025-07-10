import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.{md,mdc,yml}',
      schema: z.object({
        excerpt: z.object({
          type: z.string(),
          children: z.any(),
        }),
      }),
    })
  }
})
