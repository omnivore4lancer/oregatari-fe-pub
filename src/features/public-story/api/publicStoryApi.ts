import type { PublicStory } from '../types'

const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const publicStoryApi = {
  getStory: async (storyId: number): Promise<PublicStory> => {
    const res = await fetch(`${BASE}/public/stories/${storyId}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
    }
    return res.json() as Promise<PublicStory>
  },
}
