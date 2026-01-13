import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
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

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists(), refetchType: 'active' })
    },
  })
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<categoryService.Category> }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists(), refetchType: 'active' })
    },
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists(), refetchType: 'active' })
    },
  })
}
