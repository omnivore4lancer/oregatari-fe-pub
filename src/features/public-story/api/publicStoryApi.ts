import type { EpisodePageData } from '../../episode'
import type { PublicStory } from '../types'

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function fetchPublic<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const publicStoryApi = {
  getStory: (storyId: number) =>
    fetchPublic<PublicStory>(`${BASE}/public/stories/${storyId}`),

  getEpisodePages: (episodeId: number) =>
    fetchPublic<EpisodePageData[]>(`${BASE}/public/episodes/${episodeId}/pages`),
}
