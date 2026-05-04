import { apiClient } from '../../../lib/apiClient'
import type { Episode, EpisodeRelation, EpisodeStatus, GeneratingState } from '../types'

export interface EpisodeResponse {
  id: number
  storyId: number
  number: number
  title: string
  description: string | null
  content: string | null
  status: 'UNPUBLISHED' | 'PUBLISHED'
  relation: 'SEQUEL' | 'PARALLEL' | 'STANDALONE'
  generatingState: 'GENERATING' | 'DONE'
  parentId: number | null
  characters: { episodeId: number; characterId: number; importance: number }[]
  inheritRelation: boolean
  createdAt: string
  updatedAt: string
  _count: { pages: number }
}

const STATUS_MAP: Record<EpisodeResponse['status'], EpisodeStatus> = {
  UNPUBLISHED: 'unpublished',
  PUBLISHED: 'published',
}
const RELATION_MAP: Record<EpisodeResponse['relation'], EpisodeRelation> = {
  SEQUEL: 'sequel',
  PARALLEL: 'parallel',
  STANDALONE: 'standalone',
}
const GENERATING_MAP: Record<EpisodeResponse['generatingState'], GeneratingState> = {
  GENERATING: 'generating',
  DONE: 'done',
}

export const STATUS_TO_BE: Record<EpisodeStatus, EpisodeResponse['status']> = {
  unpublished: 'UNPUBLISHED',
  published: 'PUBLISHED',
}
export const RELATION_TO_BE: Record<EpisodeRelation, EpisodeResponse['relation']> = {
  sequel: 'SEQUEL',
  parallel: 'PARALLEL',
  standalone: 'STANDALONE',
}

export function toEpisode(r: EpisodeResponse): Episode {
  return {
    id: r.id,
    number: r.number,
    title: r.title,
    description: r.description ?? '',
    content: r.content ?? '',
    status: STATUS_MAP[r.status],
    relation: RELATION_MAP[r.relation],
    generatingState: GENERATING_MAP[r.generatingState],
    createdAt: r.createdAt.slice(0, 10).replace(/-/g, '/'),
    characterIds: r.characters?.map((c) => c.characterId) ?? [],
    inheritRelation: r.inheritRelation ?? true,
    hasScenes: (r._count?.pages ?? 0) > 0,
  }
}

export interface CreateEpisodeInput {
  number: number
  title: string
  description?: string
  content?: string
  status?: EpisodeResponse['status']
  relation?: EpisodeResponse['relation']
  parentId?: number | null
  characterIds?: number[]
  inheritRelation?: boolean
}

export interface GenerateEpisodeInput {
  relation: EpisodeResponse['relation']
  parentId?: number
  characterIds: number[]
  inheritRelation?: boolean
  titleHint?: string
  summaryHint?: string
}

export const episodeApi = {
  getEpisodes: (storyId: number, options?: { status?: string; relation?: string }) => {
    const params = new URLSearchParams()
    if (options?.status) params.set('status', options.status)
    if (options?.relation) params.set('relation', options.relation)
    const qs = params.toString()
    return apiClient.get<EpisodeResponse[]>(`/stories/${storyId}/episodes${qs ? `?${qs}` : ''}`)
  },
  getEpisode: (storyId: number, episodeId: number) =>
    apiClient.get<EpisodeResponse>(`/stories/${storyId}/episodes/${episodeId}`),
  createEpisode: (storyId: number, data: CreateEpisodeInput) =>
    apiClient.post<EpisodeResponse>(`/stories/${storyId}/episodes`, data),
  updateEpisode: (storyId: number, episodeId: number, data: Partial<CreateEpisodeInput>) =>
    apiClient.put<EpisodeResponse>(`/stories/${storyId}/episodes/${episodeId}`, data),
  deleteEpisode: (storyId: number, episodeId: number) =>
    apiClient.delete<{ message: string }>(`/stories/${storyId}/episodes/${episodeId}`),
  publishEpisode: (storyId: number, episodeId: number) =>
    apiClient.post<EpisodeResponse>(`/stories/${storyId}/episodes/${episodeId}/publish`, {}),
  unpublishEpisode: (storyId: number, episodeId: number) =>
    apiClient.post<EpisodeResponse>(`/stories/${storyId}/episodes/${episodeId}/unpublish`, {}),
  generateStream: (storyId: number, data: GenerateEpisodeInput) =>
    apiClient.stream(`/stories/${storyId}/episodes/generate/stream`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  generateBackground: (storyId: number, data: GenerateEpisodeInput) =>
    apiClient.post<{ runId: string }>(`/stories/${storyId}/episodes/generate/background`, data),
  generatePages: (storyId: number, episodeId: number) =>
    apiClient.stream(`/stories/${storyId}/episodes/${episodeId}/pages/generate`, { method: 'POST' }),
  streamCreate: async (
    storyId: number,
    input: GenerateEpisodeInput,
    onChunk: (text: string) => void,
    onFullText: (text: string) => void,
  ): Promise<void> => {
    const res = await episodeApi.generateStream(storyId, input)
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
    }

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const raw = line.slice(5).trim()
        if (!raw || raw === '[DONE]') continue
        try {
          const event = JSON.parse(raw)
          if (event.type === 'text-delta' && event.payload?.text) {
            onChunk(event.payload.text)
          } else if (event.type === 'workflow-step-result' && event.payload?.output?.text) {
            onFullText(event.payload.output.text)
          } else if (event.type === 'workflow-finish') {
            return
          } else if (event.type === 'error' || event.type === 'workflow-failed') {
            const err = event.payload?.error ?? event.payload
            const msg =
              typeof err === 'string'
                ? err
                : typeof err === 'object' && err !== null
                  ? ((err as Record<string, unknown>).message as string | undefined) ?? JSON.stringify(err)
                  : 'エピソード生成に失敗しました'
            throw new Error(msg)
          }
        } catch (e) {
          if (!(e instanceof SyntaxError)) throw e
          // ignore malformed SSE lines
        }
      }
    }
  },
}
