const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend.abuamar.online'

interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
}

class HttpClient {
  private token: string | null = null

  constructor() {
    // SSR/prerender-safe: there is never a token on the server (lazy re-read on client is fine)
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const text = await res.text()
    let json: ApiResponse<T> | null = null
    try {
      json = text ? (JSON.parse(text) as ApiResponse<T>) : null
    } catch {
      json = null
    }

    const isJsonSuccess = json !== null && typeof (json as any).success === 'boolean'
    if (!res.ok || (isJsonSuccess && !(json as ApiResponse<T>).success)) {
      const msg =
        (json as any)?.message ||
        (json as any)?.errors?.join(', ') ||
        (text ? text.slice(0, 500) : '') ||
        `Request gagal: ${res.status}`
      const err: any = new Error(msg)
      err.status = res.status
      err.statusCode = res.status
      err.code = res.status
      throw err
    }

    if (json !== null && (json as any).data !== undefined) {
      return (json as any).data as T
    }
    // Fallback: some endpoints may return raw shape without data wrapper
    if (json !== null) {
      return json as unknown as T
    }
    return text as unknown as T
  }

  get<T>(path: string) {
    return this.request<T>('GET', path)
  }
  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body)
  }
  put<T>(path: string, body?: unknown) {
    return this.request<T>('PUT', path, body)
  }
  delete<T>(path: string) {
    return this.request<T>('DELETE', path)
  }
}

export const api = new HttpClient()
