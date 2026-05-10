import { ApiError, apiClient } from '../../../lib/apiClient'

export interface Genre {
  id: number
  name: string
}

export interface StoryResponse {
  id: number
  name: string
  genres: Genre[]
  worldSetting: string
  era: string
  additionalElements: string | null
  eraBg: string | null
  intro: string | null
  dev: string | null
  climax: string | null
  conclusion: string | null
  coverImageUrl?: string | null
  previewImages?: string[]
  createdAt: string
  updatedAt: string
}

export type EraKey = 'MODERN' | 'MEDIEVAL' | 'FUTURE'
export const ERA_LABEL: Record<EraKey, string> = {
  MODERN: '現代',
  MEDIEVAL: '古代/中世',
  FUTURE: '未来/SF',
}
export const LABEL_TO_ERA: Record<string, EraKey> = {
  現代: 'MODERN',
  '古代/中世': 'MEDIEVAL',
  '未来/SF': 'FUTURE',
}

export const genreApi = {
  getGenres: () => apiClient.get<Genre[]>('/genres'),
}

export interface CreateStoryInput {
  name: string
  genreIds: number[]
  worldSetting: string
  era: EraKey
  additionalElements?: string
}

export interface UpdateStoryInput {
  name?: string
  genreIds?: number[]
  worldSetting?: string
  era?: EraKey
  additionalElements?: string
  eraBg?: string
  intro?: string
  dev?: string
  climax?: string
  conclusion?: string
}

export const storyApi = {
  getStories: () => apiClient.get<StoryResponse[]>('/stories'),
  getStory: (id: number) => apiClient.get<StoryResponse>(`/stories/${id}`),
  createStory: (data: CreateStoryInput) => apiClient.post<StoryResponse>('/stories', data),
  updateStory: (id: number, data: UpdateStoryInput) =>
    apiClient.put<StoryResponse>(`/stories/${id}`, data),
  deleteStory: (id: number) => apiClient.delete<{ message: string }>(`/stories/${id}`),

  generateStory: async (id: number, onChunk: (text: string) => void): Promise<void> => {
    const res = await apiClient.stream(`/stories/${id}/generate`, { method: 'POST' })
    if (!res.ok || !res.body) {
      throw new ApiError(res.status, `HTTP ${res.status}`)
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    try {
      let buf = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const parts = buf.split('\n\n')
        buf = parts.pop() ?? ''
        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (!line.startsWith('data:')) continue
            try {
              const ev = JSON.parse(line.slice(5)) as { text?: string; error?: string }
              if (ev.text) onChunk(ev.text)
              if (ev.error) throw new ApiError(500, ev.error)
            } catch (e) {
              if (e instanceof ApiError) throw e
              /* ignore other malformed JSON */
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  },
}
