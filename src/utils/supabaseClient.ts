import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Database tidak tersedia. VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum dikonfigurasi.',
    )
  }
  return supabase
}

export const isSupabaseAvailable = () => supabase !== null

export const AMALAN_BUCKET_ID = 'amalan-md'
