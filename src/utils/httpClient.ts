const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend.abuamar.online'

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.data ?? json
}
