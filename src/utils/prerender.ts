// Build-time helpers for vite-ssg prerendering.
// Runs in Node (SSR build + vite.config onFinished) where import.meta.env is
// still replaced by Vite with the loaded .env values.

export const PRERENDER_API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://backend.abuamar.online'

/**
 * Fetch every amalan slug from the public API. Used to expand the dynamic
 * `/amalan/:slug` route into concrete paths for prerendering + the sitemap.
 * Never throws — returns [] on any failure so the build degrades gracefully.
 */
export async function fetchAmalanSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${PRERENDER_API_BASE}/api/v1/asyaikhoni/amalan?limit=100`)
    if (!res.ok) return []
    const json = await res.json()
    const amalan = json?.data?.amalan
    if (!Array.isArray(amalan)) return []
    return amalan.map((a: any) => String(a?.slug)).filter(Boolean)
  } catch {
    return []
  }
}