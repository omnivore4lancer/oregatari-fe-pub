import { apiClient } from '../../../lib/apiClient'

export interface PublishSettingsResponse {
  storyId: number
  characterIds: number[]
  visualStyle: string | null
  layout: string | null
  description: string | null
  tags: string[]
  coverImageUrl: string | null
  publishedAt: string | null
  updatedAt: string
}

export interface UpsertPublishSettingsInput {
  characterIds: number[]
  visualStyle?: string
  layout?: string
  description?: string
  tags?: string[]
  coverImageUrl?: string
}

export const publishApi = {
  getPublishSettings: (storyId: number) =>
    apiClient.get<PublishSettingsResponse | null>(`/stories/${storyId}/publish`),

  upsertPublishSettings: (storyId: number, data: UpsertPublishSettingsInput) =>
    apiClient.put<PublishSettingsResponse>(`/stories/${storyId}/publish`, data),

  publishStory: (storyId: number) =>
    apiClient.post<PublishSettingsResponse>(`/stories/${storyId}/publish/release`),

  unpublishStory: (storyId: number) =>
    apiClient.delete<PublishSettingsResponse>(`/stories/${storyId}/publish/release`),

  generateCoverImageJob: (storyId: number) =>
    apiClient.post<{ jobId: string }>(`/stories/${storyId}/publish/generate-cover-image-job`),

  getJobStatus: (jobId: string) =>
    apiClient.get<{ id: string; status: 'RUNNING' | 'DONE' | 'FAILED'; errorMessage: string | null }>(
      `/jobs/${jobId}`,
    ),
}
