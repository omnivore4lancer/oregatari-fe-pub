import { apiClient } from '../../../lib/apiClient'
import type { EpisodePageData } from '../types/episodePage'

export type ActiveJob = {
  id: string
  pageNumber: number | null
  status: 'running' | 'failed' | 'done'
  errorMessage: string | null
  jobType: 'image_generation' | 'panel_layout'
  usedModel: string | null
  imageModel: string | null
}

export const episodePageApi = {
  getPages: (storyId: number, episodeId: number) =>
    apiClient.get<EpisodePageData[]>(`/stories/${storyId}/episodes/${episodeId}/pages`),

  regenerate: (storyId: number, episodeId: number) =>
    apiClient.stream(`/stories/${storyId}/episodes/${episodeId}/pages/generate`, { method: 'POST' }),

  generatePrompt: (storyId: number, episodeId: number) =>
    apiClient.stream(`/stories/${storyId}/episodes/${episodeId}/pages/generate-prompt`, { method: 'POST' }),

  generateImage: (storyId: number, episodeId: number, pageNumber: number) =>
    apiClient.stream(`/stories/${storyId}/episodes/${episodeId}/pages/generate-image`, {
      method: 'POST',
      body: JSON.stringify({ pageNumber }),
    }),

  getActiveJobs: (storyId: number, episodeId: number) =>
    apiClient.get<ActiveJob[]>(`/stories/${storyId}/episodes/${episodeId}/pages/jobs`),

  createImageJob: (storyId: number, episodeId: number, pageNumber: number) =>
    apiClient.post<{ jobId: string }>(
      `/stories/${storyId}/episodes/${episodeId}/pages/generate-image-job`,
      { pageNumber },
    ),

  createLayoutJob: (storyId: number, episodeId: number) =>
    apiClient.post<{ jobId: string }>(
      `/stories/${storyId}/episodes/${episodeId}/pages/generate-layout-job`,
    ),

  subscribeJobEvents: async (
    jobId: string,
    signal: AbortSignal,
    onChunk: (text: string) => void,
  ): Promise<void> => {
    const res = await apiClient.stream(`/jobs/${jobId}/events`, { signal })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
    }
    if (!res.body) return

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      for (const line of chunk.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (!payload || payload === '[DONE]') continue
        try {
          const parsed = JSON.parse(payload) as Record<string, unknown>
          if (parsed.status === 'failed') {
            throw new Error((parsed.error as string | null) ?? '画像生成に失敗しました')
          }
          if (parsed.status === 'success') return
          const text = (parsed.text ?? parsed.textDelta ?? parsed.chunk ?? '') as string
          if (text) onChunk(text)
        } catch (e) {
          if (e instanceof SyntaxError) {
            onChunk(payload)
          } else {
            throw e
          }
        }
      }
    }
  },
}
