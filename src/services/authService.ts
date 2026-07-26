import { queryClient } from '@/utils/queryClient'
import { supabase } from '@/utils/supabaseClient'

const adminQueryKey = ['auth', 'is-admin'] as const
const ADMIN_CACHE_TTL = 60 * 1000 // 1 menit

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  await invalidateAdminCache()
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  await invalidateAdminCache()
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function isAdmin(): Promise<boolean> {
  // TanStack Query cache with short TTL
  const result = await queryClient.fetchQuery({
    queryKey: adminQueryKey,
    staleTime: ADMIN_CACHE_TTL,
    gcTime: ADMIN_CACHE_TTL * 2,
    queryFn: async () => {
      const session = await getSession()
      if (!session?.user?.id) return false
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .limit(1)
      if (error) {
        console.error('isAdmin check error', error)
        return false
      }
      return Array.isArray(data) && data.length > 0
    },
  })

  return result
}

export async function invalidateAdminCache() {
  await queryClient.invalidateQueries({ queryKey: adminQueryKey })
  const session = await getSession()
  if (!session?.user?.id) return
}
