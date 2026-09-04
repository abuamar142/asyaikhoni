import { useQuery } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { unref } from 'vue'
import * as amalanService from '@/services/amalanService'

// Query keys for cache management
export const amalanKeys = {
  all: ['amalan'] as const,
  lists: () => [...amalanKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...amalanKeys.lists(), filters] as const,
  details: () => [...amalanKeys.all, 'detail'] as const,
  detail: (id: string) => [...amalanKeys.details(), id] as const,
  bySlug: (slug: string) => [...amalanKeys.details(), 'slug', slug] as const,
}

// Public amalan list query
export function useAmalanListQuery(
  params?: MaybeRef<{
    q?: string
    kategori?: string | string[]
    kategoriIds?: string[]
    limit?: number
    offset?: number
  }>,
) {
  return useQuery(() => ({
    queryKey: amalanKeys.list({ scope: 'public', ...unref(params) }),
    queryFn: () => amalanService.listPublic(unref(params)),
    // Keep the previous page visible while a larger page (load more) is fetching
    placeholderData: (previousData) => previousData,
  }))
}

// Amalan by slug query
export function useAmalanBySlugQuery(slug: MaybeRef<string>) {
  return useQuery({
    queryKey: amalanKeys.bySlug(unref(slug)),
    queryFn: () => amalanService.getBySlug(unref(slug)),
    enabled: !!unref(slug),
  })
}

// Note: useAmalanByIdQuery + useMarkdownQuery removed (dead code, exp-12).
// AmalanSharePreview uses direct amalanService.downloadMarkdown() fallback, no query wrapper needed.
