import createClient from 'openapi-fetch'
import type { paths } from '../types/api'
import { supabase } from './supabase'

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function createTypedApiClient(baseUrl?: string) {
  const client = createClient<paths>({
    baseUrl: baseUrl ?? (import.meta.env?.VITE_API_BASE_URL ?? '/api'),
  })

  client.use({
    async onRequest({ request }) {
      const headers = await authHeaders()
      Object.entries(headers).forEach(([k, v]) => request.headers.set(k, v))
      return request
    },
  })

  return client
}

export const typedApiClient = createTypedApiClient()
