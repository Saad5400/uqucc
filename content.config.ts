import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { asRobotsCollection } from '@nuxtjs/robots/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection(asSitemapCollection(asRobotsCollection({
      type: 'page',
      source: '**/*.{md,mdc,yml}',
      schema: z.object({
        excerpt: z.object({
          type: z.string(),
          children: z.any(),
        }),
      }),
    })))
  }
})
