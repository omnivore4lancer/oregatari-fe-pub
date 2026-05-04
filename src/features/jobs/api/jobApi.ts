import { apiClient } from '../../../lib/apiClient'

export type JobStatus = 'RUNNING' | 'DONE' | 'FAILED'
export type JobType = 'IMAGE_GENERATION' | 'PANEL_LAYOUT' | 'COVER_IMAGE'

export type JobListItem = {
  id: string
  storyId: number | null
  pageNumber: number | null
  jobType: JobType
  status: JobStatus
  errorMessage: string | null
  usedModel: string | null
  imageModel: string | null
  createdAt: string
  updatedAt: string
  episode: {
    id: number
    number: number
    title: string
    story: { id: number; name: string }
  } | null
}

export type JobListResponse = {
  jobs: JobListItem[]
  total: number
  page: number
  limit: number
}

export const jobApi = {
  getJobs: (params?: { page?: number; limit?: number; status?: JobStatus; jobType?: JobType }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.limit) query.set('limit', String(params.limit))
    if (params?.status) query.set('status', params.status)
    if (params?.jobType) query.set('jobType', params.jobType)
    const qs = query.toString()
    return apiClient.get<JobListResponse>(`/jobs${qs ? `?${qs}` : ''}`)
  },
}
