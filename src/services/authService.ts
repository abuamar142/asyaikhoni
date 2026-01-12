import { supabase } from '@/utils/supabaseClient'

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function isAdmin(): Promise<boolean> {
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
}
