import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
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
    kategori?: string
    limit?: number
    offset?: number
  }>,
) {
  return useQuery({
    queryKey: amalanKeys.list({ scope: 'public', ...unref(params) }),
    queryFn: () => amalanService.listPublic(unref(params)),
  })
}

// Admin amalan list query
export function useAdminAmalanListQuery(
  params?: MaybeRef<{
    q?: string
    kategori?: string
    limit?: number
    offset?: number
  }>,
) {
  return useQuery({
    queryKey: amalanKeys.list({ scope: 'admin', ...unref(params) }),
    queryFn: () => amalanService.listAll(unref(params)),
  })
}

// Amalan by slug query
export function useAmalanBySlugQuery(slug: MaybeRef<string>) {
  return useQuery({
    queryKey: amalanKeys.bySlug(unref(slug)),
    queryFn: () => amalanService.getBySlug(unref(slug)),
    enabled: !!unref(slug),
  })
}

// Amalan by ID query
export function useAmalanByIdQuery(id: MaybeRef<string>) {
  return useQuery({
    queryKey: amalanKeys.detail(unref(id)),
    queryFn: () => amalanService.getById(unref(id)),
    enabled: !!unref(id),
  })
}

// Markdown download query
export function useMarkdownQuery(bucketId: MaybeRef<string>, path: MaybeRef<string>) {
  return useQuery({
    queryKey: ['markdown', unref(bucketId), unref(path)] as const,
    queryFn: () => amalanService.downloadMarkdown(unref(bucketId), unref(path)),
    enabled: !!unref(bucketId) && !!unref(path),
  })
}

// Create amalan mutation
export function useCreateAmalanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: amalanService.createAmalan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amalanKeys.lists(), refetchType: 'active' })
    },
  })
}

// Update amalan mutation
export function useUpdateAmalanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Parameters<typeof amalanService.updateAmalan>[1]
    }) => amalanService.updateAmalan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: amalanKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: amalanKeys.lists(), refetchType: 'active' })
    },
  })
}

// Delete amalan mutation
export function useDeleteAmalanMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, deleteFile }: { id: string; deleteFile?: boolean }) =>
      amalanService.deleteAmalan(id, { deleteFile }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: amalanKeys.lists(), refetchType: 'active' })
    },
  })
}

// Toggle aktif mutation
export function useToggleAktifMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, aktif }: { id: string; aktif: boolean }) =>
      amalanService.toggleAktif(id, aktif),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: amalanKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: amalanKeys.lists(), refetchType: 'active' })
    },
  })
}
