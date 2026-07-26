import { useQuery } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { unref } from 'vue'
import * as categoryService from '@/services/categoryService'

export const categoryKeys = {
  all: ['kategori'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...categoryKeys.lists(), filters] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
}

export function useCategoryListQuery(
  params?: MaybeRef<{
    q?: string
  }>,
) {
  return useQuery({
    queryKey: categoryKeys.list(unref(params)),
    queryFn: () => categoryService.listCategories(unref(params)),
  })
}
