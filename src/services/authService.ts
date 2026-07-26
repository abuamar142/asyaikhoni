import { api } from '@/utils/httpClient'
import { queryClient } from '@/utils/queryClient'

const adminQueryKey = ['auth', 'is-admin'] as const
const ADMIN_CACHE_TTL = 60 * 1000 // 1 menit

interface AuthData {
  user: { id: string; email: string; name?: string; role: string }
  token: string
}

interface ProfileData {
  user: { id: string; email: string; name?: string; role: string }
  isAdmin: boolean
}

export async function login(email: string, password: string) {
  const result = await api.post<AuthData>('/api/v1/asyaikhoni/auth/login', { email, password })
  api.setToken(result.token)
  await invalidateAdminCache()
  return result
}

export async function logout() {
  api.setToken(null)
  await invalidateAdminCache()
}

export async function getSession() {
  const token = api.getToken()
  if (!token) return null
  try {
    const result = await api.get<ProfileData>('/api/v1/asyaikhoni/auth/me')
    return { user: result.user, token }
  } catch {
    api.setToken(null)
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const result = await queryClient.fetchQuery({
    queryKey: adminQueryKey,
    staleTime: ADMIN_CACHE_TTL,
    gcTime: ADMIN_CACHE_TTL * 2,
    queryFn: async () => {
      try {
        const result = await api.get<ProfileData>('/api/v1/asyaikhoni/auth/me')
        return result.isAdmin
      } catch {
        return false
      }
    },
  })

  return result
}

export async function invalidateAdminCache() {
  await queryClient.invalidateQueries({ queryKey: adminQueryKey })
}
